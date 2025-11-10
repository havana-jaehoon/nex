import json, os, threading
import pandas as pd
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Tuple, Optional
from pydantic import ValidationError

from auth import url_def
from auth.auth_base import AuthBase
from auth.token.token_base import TokenBase
from auth.msg_def import AgentInitRequest, AgentTokenRequest, AgentTokenResponsePayload, AgentTokenResponse, AgentInitResponse
from element.element_mgr import ElementMgr
from system_info import SystemInfoMgr
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, HandlerArgs, BodyData, Server_Dynamic_Handler
from util.log_util import Logger


@dataclass
class AgentAccess:
    project: str
    system: str
    ip: str
    updated_at: datetime


class AuthServer(AuthBase):

    SYSTEM_NAME = 'webserver'
    INTERNAL_ELEMENT_CONFIG_FILE_NAME = 'auth_server_element_config.json'
    PROFILE_ELEMENT_ID = '/agent/profile'
    ACCESS_ELEMENT_ID = '/agent/access'

    def __init__(self, base_dir: str, token_method: str):
        super().__init__(base_dir)
        self._tokenObj = self._loadTokenObj(token_method)
        self._challengeLock = threading.Lock()
        self._challengeStore = {}

    @staticmethod
    def _loadTokenObj(token_method: str):
        token_obj = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/auth/token', '', os.path.basename(token_method))
        if token_obj is None or not isinstance(token_obj, TokenBase):
            raise SystemExit(f"token method({token_method}) is not valid")
        return token_obj

    def _storeChallenge(self, agent_id: str, challenge: str):
        with self._challengeLock:
            self._challengeStore[agent_id] = challenge

    def _deleteChallenge(self, agent_id: str):
        with self._challengeLock:
            del self._challengeStore[agent_id]

    def _getChallenge(self, agent_id: str) -> Optional[str]:
        with self._challengeLock:
            return self._challengeStore.get(agent_id, None)

    def _proc_initiate(self, body: BodyData, profile_df: pd.DataFrame) -> Tuple[str, HandlerResult]:
        if isinstance(body, dict):
            validated_request = AgentInitRequest.model_validate(body)
        else:
            validated_request = AgentInitRequest.model_validate_json(body)
        agent_id = validated_request.agent_id
        agent_profile_df = profile_df[profile_df['agent_id'] == agent_id]
        handler_result = HandlerResult()
        if agent_profile_df.empty:
            handler_result.status = 401
            handler_result.body = 'agent_id is not valid'
        else:
            if agent_profile_df['project'].iloc[0] != self._projectName:
                handler_result.status = 401
                handler_result.body = 'project is not valid'
            else:
                challenge = os.urandom(16).hex()
                self._storeChallenge(agent_id, challenge)
                handler_result.status = 200
                handler_result.body = AgentInitResponse(
                    token_method=self._tokenObj.name,
                    challenge=challenge
                ).model_dump()
        return agent_id, handler_result

    def _proc_token(self, client_ip: str, body: BodyData, profile_df: pd.DataFrame) \
            -> Tuple[str, HandlerResult, Optional[AgentAccess]]:
        if isinstance(body, dict):
            validated_request = AgentTokenRequest.model_validate(body)
        else:
            validated_request = AgentTokenRequest.model_validate_json(body)
        agent_id = validated_request.agent_id
        auth_token = validated_request.auth_token
        agent_profile_df = profile_df[profile_df['agent_id'] == agent_id]
        handler_result = HandlerResult()
        agent_access: Optional[AgentAccess] = None
        if agent_profile_df.empty:
            handler_result.status = 401
            handler_result.body = 'agent_id is not valid'
        else:
            if agent_profile_df['project'].iloc[0] != self._projectName:
                handler_result.status = 401
                handler_result.body = 'project is not valid'
            else:
                server_challenge = self._getChallenge(agent_id)
                if server_challenge is None:
                    handler_result.status = 401
                    handler_result.body = 'challenge is not valid'
                else:
                    msg_challenge = self._tokenObj.validateAuthToken(auth_token, agent_profile_df['secret_key'].iloc[0])
                    if msg_challenge == server_challenge:
                        self._deleteChallenge(agent_id)
                        agent_project = agent_profile_df['project'].iloc[0]
                        agent_system = agent_profile_df['system'].iloc[0]
                        handler_result.status = 200
                        handler_result.body = AgentTokenResponse(
                            access_token=self._tokenObj.genAccessToken(agent_id, SystemInfoMgr().secretKey),
                            token_type='Bearer',
                            payload=AgentTokenResponsePayload(project=agent_project, system=agent_system)
                        ).model_dump()
                        agent_access = AgentAccess(agent_project, agent_system, client_ip, datetime.now())
                    else:
                        handler_result.status = 401
                        handler_result.body = 'auth_token is not valid'
        return agent_id, handler_result, agent_access

    async def _rcvAuthInit(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        handler_result = HandlerResult()
        agent_id = None
        try:
            profile_df = await ElementMgr().getData(AuthServer.PROFILE_ELEMENT_ID)
            agent_id, handler_result = self._proc_initiate(handler_args.body, profile_df)
        except ValidationError as e:
            Logger().log_error(f'AuthServer : AuthInit : Pydantic validation failed: {e}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except json.JSONDecodeError:
            Logger().log_error(f'AuthServer : AuthInit : JSON decode failed. Response: {handler_args.body}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except Exception as e:
            Logger().log_error(f'AuthServer : AuthInit : exception : {e}')
            handler_result.status = 500
            handler_result.body = f'exception : {e}'
        Logger().log_info(f'AuthServer : AuthInit : agent({agent_id}) : response {handler_result.status}, {handler_result.body}')
        return handler_result

    async def _rcvAuthToken(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        handler_result = HandlerResult()
        agent_id = None
        try:
            profile_df = await ElementMgr().getData(AuthServer.PROFILE_ELEMENT_ID)
            agent_id, handler_result, agent_access = self._proc_token(handler_args.client_ip, handler_args.body, profile_df)
            if handler_result.status == 200:
                ElementMgr().setData(AuthServer.ACCESS_ELEMENT_ID, pd.DataFrame([asdict(agent_access)]))
        except ValidationError as e:
            Logger().log_error(f'AuthServer : AuthToken : Pydantic validation failed: {e}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except json.JSONDecodeError:
            Logger().log_error(f'AuthServer : AuthToken : JSON decode failed. Response: {handler_args.body}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except Exception as e:
            Logger().log_error(f'AuthServer : AuthToken : exception : {e}')
            handler_result.status = 500
            handler_result.body = f'exception : {e}'
        Logger().log_info(f'AuthServer : AuthToken : agent({agent_id}) : response {handler_result.status}, {handler_result.body}')
        return handler_result

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            (url_def.AUTH_INIT_URL, self._rcvAuthInit, {}),
            (url_def.AUTH_TOKEN_URL, self._rcvAuthToken, {}),
        ]
        return handler_list

    def init(self) -> bool:
        self._logger.log_info(f'AuthServer : init : start')
        if super()._init(SystemInfoMgr().project, AuthServer.SYSTEM_NAME):
            self._logger.log_info(f'AuthServer : init : success')
            return True
        else:
            self._logger.log_error(f'AuthServer : init : fail')
            return False

    @staticmethod
    def getInternalElementConfigFile() -> str:
        return f'{SystemInfoMgr().src_dir}/auth/{AuthServer.INTERNAL_ELEMENT_CONFIG_FILE_NAME}'

    @staticmethod
    async def isAccess(project: str, system: str, ip: str) -> bool:
        access_df = await ElementMgr().getData(AuthServer.ACCESS_ELEMENT_ID, {'project': project, 'system': system, 'ip': ip})
        return False if access_df.empty else True

    @staticmethod
    def getProfileElementId() -> str:
        return AuthServer.PROFILE_ELEMENT_ID

    @staticmethod
    def getAccessElementId() -> str:
        return AuthServer.ACCESS_ELEMENT_ID

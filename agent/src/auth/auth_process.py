import re, json, os
import pandas as pd
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Tuple, Optional

from pydantic import ValidationError
from abc import abstractmethod

from auth.msg_def import AuthElement, AgentInitRequest, AgentTokenRequest
from base_process import FuncElementProcess
from system_info import SystemInfoMgr
from util.pi_http.http_handler import HandlerResult, BodyData
from util.log_util import Logger


@dataclass
class AgentAccess:
    project: str
    system: str
    ip: str
    port: int
    updated_at: datetime


class AuthProcess(FuncElementProcess):

    def __init__(self):
        super().__init__()
        self._challenge_store = {}

    @abstractmethod
    def _self_name(self) -> str:
        pass

    @abstractmethod
    def gen_auth_token(self, agent_id: str, challenge: str, secret_key: str) -> str:
        pass

    @abstractmethod
    def validate_auth_token(self, auth_token: str, secret_key: str) -> str:
        pass

    @abstractmethod
    def gen_access_token(self, agent_id: str, secret_key: str) -> str:
        pass

    def _proc_initiate(self, body: BodyData, auth_info: pd.DataFrame) -> Tuple[str, HandlerResult]:
        handler_result = HandlerResult()
        if isinstance(body, dict):
            validated_request = AgentInitRequest.model_validate(body)
        else:
            validated_request = AgentInitRequest.model_validate_json(body)
        result_df = auth_info[auth_info['agent_id'] == validated_request.agent_id]
        if result_df.empty:
            handler_result.status = 401
            handler_result.body = 'agent_id is not valid'
        else:
            challenge = os.urandom(16).hex()
            self._challenge_store[validated_request.agent_id] = challenge
            handler_result.status = 200
            handler_result.body = {'token_method': self._self_name(), 'challenge': challenge}
        return validated_request.agent_id, handler_result

    def _proc_token(self, body: BodyData, auth_info: pd.DataFrame) -> Tuple[str, HandlerResult, Optional[AgentAccess]]:
        handler_result = HandlerResult()
        agent_access: Optional[AgentAccess] = None
        if isinstance(body, dict):
            validated_request = AgentTokenRequest.model_validate(body)
        else:
            validated_request = AgentTokenRequest.model_validate_json(body)
        agent_id = validated_request.agent_id
        auth_token = validated_request.auth_token
        ip = validated_request.ip
        port = validated_request.port
        server_auth_info = auth_info[auth_info['agent_id'] == agent_id]
        if server_auth_info.empty:
            handler_result.status = 401
            handler_result.body = 'agent_id is not valid'
        else:
            server_challenge = self._challenge_store.get(agent_id, None)
            if server_challenge is None:
                handler_result.status = 401
                handler_result.body = 'challenge is not valid'
            else:
                client_challenge = self.validate_auth_token(auth_token, server_auth_info['secret_key'].iloc[0])
                if client_challenge == server_challenge:
                    del self._challenge_store[agent_id]
                    handler_result.status = 200
                    handler_result.body = {
                        'access_token': self.gen_access_token(agent_id, SystemInfoMgr().secret_key),
                        'token_type': 'Bearer',
                        'project': server_auth_info['project'].iloc[0],
                        'system': server_auth_info['system'].iloc[0]
                    }
                    agent_access = AgentAccess(server_auth_info['project'].iloc[0],
                                               server_auth_info['system'].iloc[0],
                                               ip, port, datetime.now())
                else:
                    handler_result.status = 401
                    handler_result.body = 'auth_token is not valid'
        return agent_id, handler_result, agent_access

    async def process(self,
                      exp: re.Match,
                      body: BodyData,
                      inputs: List[Tuple[str, pd.DataFrame]],
                      kwargs: dict) -> Tuple[HandlerResult, List[pd.DataFrame]]:
        handler_result = HandlerResult()
        df_list: List[pd.DataFrame] = []
        agent_id = ''
        try:
            sub_path = exp.group(1)
            if sub_path == AuthElement.AUTH_INIT_ELEMENT:
                agent_id, handler_result = self._proc_initiate(body, inputs[0][1])
            elif sub_path == AuthElement.AUTH_TOKEN_ELEMENT:
                agent_id, handler_result, agent_access = self._proc_token(body, inputs[0][1])
                df_list.append(pd.DataFrame([asdict(agent_access)]))
            else:
                Logger().log_error(f'AuthProcess : req_custom_handler : unknown sub-path : {sub_path}')
                handler_result.status = 404
                handler_result.body = f'unknown sub-path : {sub_path}'
        except ValidationError as e:
            Logger().log_error(f'AuthProcess : req_custom_handler : Pydantic validation failed: {e}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except json.JSONDecodeError:
            Logger().log_error(f'AuthProcess : req_custom_handler : JSON decode failed. Response: {body}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except Exception as e:
            Logger().log_error(f'AuthProcess : req_custom_handler : exception : {e}')
            handler_result.status = 500
            handler_result.body = f'exception : {e}'
        Logger().log_info(f'AuthProcess : agent({agent_id}) : response {handler_result.status}, {handler_result.body}')
        return handler_result, df_list

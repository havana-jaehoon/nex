import time, json, os
from typing import Optional
from pydantic import ValidationError

from auth import url_def
from auth.auth_base import AuthBase
from auth.msg_def import AgentInitResponse, AgentTokenResponse, AgentInitRequest, AgentTokenRequest
from auth.token.token_base import TokenBase
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from util.module_loader import ModuleLoader
from util.log_util import Logger


class AuthAgent(AuthBase):

    AUTH_PAYLOAD_ACCESS_TOKEN = 'access_token'

    def __init__(self, base_dir: str):
        super().__init__(base_dir)

    @staticmethod
    def _init_req() -> Optional[AgentInitResponse]:
        target_ip = SystemInfoMgr().serverIp
        target_port = SystemInfoMgr().serverPort
        agent_id = SystemInfoMgr().agentId
        body = AgentInitRequest(agent_id=agent_id).model_dump()
        status, rsp_body_str = HttpReqMgr().post1Once(target_ip, target_port, url_def.AUTH_INIT_URL, body)
        if status == 200:
            try:
                validated_response = AgentInitResponse.model_validate_json(rsp_body_str)
                Logger().log_info(f'AuthAgent : init_req : rsp : {validated_response}')
                return validated_response
            except ValidationError as e:
                Logger().log_error(f'AuthAgent : init_req : Pydantic validation failed: {e}')
                return None
            except json.JSONDecodeError:
                Logger().log_error(f'AuthAgent : init_req : JSON decode failed. Response: {rsp_body_str}')
                return None
            except Exception as e:
                Logger().log_error(f'AuthAgent : init_req : exception : {e}')
                return None
        else:
            Logger().log_error(f'AuthAgent : init_req : status : {status}, {rsp_body_str}')
            return None

    @staticmethod
    def _token_req(agent_init_rsp: AgentInitResponse) -> Optional[AgentTokenResponse]:
        target_ip = SystemInfoMgr().serverIp
        target_port = SystemInfoMgr().serverPort
        agent_id = SystemInfoMgr().agentId
        secret_key = SystemInfoMgr().secretKey

        token_method = agent_init_rsp.token_method
        challenge = agent_init_rsp.challenge
        # load token-method
        token_obj = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/auth/token',
                                            '',
                                            os.path.basename(token_method))
        if token_obj is None or not isinstance(token_obj, TokenBase):
            raise SystemExit(f"token method({token_method}) is not valid")
        auth_token = token_obj.genAuthToken(agent_id, challenge, secret_key)
        Logger().log_info(f'generate auth_token : {auth_token}')
        body = AgentTokenRequest(agent_id=agent_id, auth_token=auth_token).model_dump()
        status, rsp_body_str = HttpReqMgr().post1Once(target_ip, target_port, url_def.AUTH_TOKEN_URL, body)
        if status == 200:
            try:
                validated_response = AgentTokenResponse.model_validate_json(rsp_body_str)
                Logger().log_info(f'AuthAgent : token_req : rsp : {validated_response}')
                return validated_response
            except ValidationError as e:
                Logger().log_error(f'AuthAgent : token_req : Pydantic validation failed: {e}')
                return None
            except json.JSONDecodeError:
                Logger().log_error(f'AuthAgent : token_req : JSON decode failed. Response: {rsp_body_str}')
                return None
            except Exception as e:
                Logger().log_error(f'AuthAgent : token_req : exception : {e}')
                return None
        else:
            Logger().log_error(f'AuthAgent : token_req : status : {status}, {rsp_body_str}')
            return None

    def init(self) -> bool:
        self._logger.log_info(f'AuthAgent : init : start')
        while True:
            try:
                init_rsp = AuthAgent._init_req()
                if init_rsp:
                    token_rsp: AgentTokenResponse = AuthAgent._token_req(init_rsp)
                    if token_rsp:
                        auth_payload = { AuthAgent.AUTH_PAYLOAD_ACCESS_TOKEN: token_rsp.access_token }
                        if self._init(token_rsp.payload.project, token_rsp.payload.system, **auth_payload):
                            self._logger.log_info(f'AuthAgent : init : success')
                            return True
                        else:
                            self._logger.log_error(f'AuthAgent : init : fail')
                            return False
            except Exception as e:
                self._logger.log_error(f'AuthAgent : init : fail to {e}')
            time.sleep(10)

    @property
    def accessToken(self) -> Optional[str]:
        return self._authPayload.get(AuthAgent.AUTH_PAYLOAD_ACCESS_TOKEN) if self._authPayload else None

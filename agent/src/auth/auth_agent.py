import time, json
from typing import Optional
from pydantic import ValidationError

import url_def
from auth.auth_base import AuthBase
from auth.msg_def import AgentInitResponse, AgentTokenResponse, AgentInitRequest, AgentTokenRequest
from api.api_proc import HttpReqMgr
from util.log_util import Logger


class AuthAgent(AuthBase):

    AUTH_PAYLOAD_ACCESS_TOKEN = 'access_token'

    def __init__(self, config_dir: str, src_dir: str, server_ip: str, server_port: int, agent_id: str, secret_key: str):
        super().__init__(config_dir, src_dir, secret_key)
        self._serverIp = server_ip
        self._serverPort = server_port
        self._agentId = agent_id

    def _init_req(self) -> Optional[AgentInitResponse]:
        body = AgentInitRequest(agent_id=self._agentId).model_dump()
        status, rsp_body_str = HttpReqMgr().post1Once(self._serverIp,
                                                      self._serverPort,
                                                      url_def.AUTH_INIT_SUB_URL,
                                                      body)
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

    def _token_req(self, agent_init_rsp: AgentInitResponse) -> Optional[AgentTokenResponse]:
        token_method = agent_init_rsp.token_method
        challenge = agent_init_rsp.challenge
        # load token-method
        token_obj = self._loadTokenObj(token_method)
        auth_token = token_obj.genAuthToken(self._agentId, challenge, self._secretKey)
        Logger().log_info(f'generate auth_token : {auth_token}')
        body = AgentTokenRequest(agent_id=self._agentId, auth_token=auth_token).model_dump()
        status, rsp_body_str = HttpReqMgr().post1Once(self._serverIp, self._serverPort, url_def.AUTH_TOKEN_SUB_URL, body)
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

    def init(self, **kwargs) -> bool:
        self._logger.log_info(f'AuthAgent : init : start')
        while True:
            try:
                init_rsp = self._init_req()
                if init_rsp:
                    token_rsp: AgentTokenResponse = self._token_req(init_rsp)
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

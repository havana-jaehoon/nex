import time, json, os
from typing import Optional
from pydantic import ValidationError

from auth.auth_process import AuthProcess
from api.api_proc import ApiReq
from auth.msg_def import AgentInitResponse, AgentTokenResponse, AuthElement
from system_info import SystemInfoMgr
from util.module_loader import ModuleLoader
from util.log_util import Logger


class AuthAgent:

    CONFIG_PROJECT_NAME = 'Admin'
    CONFIG_SYSTEM_NAME = 'CfgServer'
    AUTH_DIR = '/auth/'

    @staticmethod
    def _init_req(system_info: SystemInfoMgr, api_req: ApiReq) -> Optional[AgentInitResponse]:
        source = f'{AuthAgent.CONFIG_PROJECT_NAME}:{AuthAgent.CONFIG_SYSTEM_NAME}:{AuthAgent.AUTH_DIR}{AuthElement.AUTH_INIT_ELEMENT}'
        body = {'agent_id': system_info.agent_id}
        status, rsp_body_str = api_req.postReq(source, body)
        if status == 200:
            try:
                validated_response = AgentInitResponse.model_validate_json(rsp_body_str)
                Logger().log_info(f'init_req : rsp : {validated_response}')
                return validated_response
            except ValidationError as e:
                Logger().log_error(f'init_req : Pydantic validation failed: {e}')
                return None
            except json.JSONDecodeError:
                Logger().log_error(f'init_req : JSON decode failed. Response: {rsp_body_str}')
                return None
            except Exception as e:
                Logger().log_error(f'init_req : exception : {e}')
                return None
        else:
            Logger().log_error(f'init_req : status : {status}, {rsp_body_str}')
            return None

    @staticmethod
    def _token_req(system_info: SystemInfoMgr, api_req: ApiReq, agent_init_rsp: AgentInitResponse) -> Optional[AgentTokenResponse]:
        source = f'{AuthAgent.CONFIG_PROJECT_NAME}:{AuthAgent.CONFIG_SYSTEM_NAME}:{AuthAgent.AUTH_DIR}{AuthElement.AUTH_TOKEN_ELEMENT}'
        token_method = agent_init_rsp.token_method
        challenge = agent_init_rsp.challenge
        # load token-method
        processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{token_method}',
                                            '',
                                            os.path.basename(token_method))
        if processor is None or not isinstance(processor, AuthProcess):
            raise SystemExit(f"token method({token_method}) is not valid")
        auth_token = processor.gen_auth_token(system_info.agent_id, challenge, system_info.secret_key)
        body = {'agent_id': system_info.agent_id, 'auth_token': auth_token, 'ip': system_info.ip, 'port': system_info.port}
        Logger().log_info(f'token_req : auth_token : {auth_token}')
        status, rsp_body_str = api_req.postReq(source, body)
        if status == 200:
            try:
                validated_response = AgentTokenResponse.model_validate_json(rsp_body_str)
                Logger().log_info(f'token_req : rsp : {validated_response}')
                return validated_response
            except ValidationError as e:
                Logger().log_error(f'token_req : Pydantic validation failed: {e}')
                return None
            except json.JSONDecodeError:
                Logger().log_error(f'token_req : JSON decode failed. Response: {rsp_body_str}')
                return None
            except Exception as e:
                Logger().log_error(f'token_req : exception : {e}')
                return None
        else:
            Logger().log_error(f'token_req : status : {status}, {rsp_body_str}')
            return None

    @staticmethod
    def auth_req(system_info: SystemInfoMgr, api_req: ApiReq):
        # init_rsp: Optional[AgentInitResponse] = None
        # token_rsp: Optional[AgentTokenResponse] = None
        while True:
            init_rsp = AuthAgent._init_req(system_info, api_req)
            if init_rsp:
                token_rsp = AuthAgent._token_req(system_info, api_req, init_rsp)
                if token_rsp:
                    break
            time.sleep(10)

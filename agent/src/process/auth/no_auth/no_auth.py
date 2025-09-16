import re, json
import pandas as pd
from datetime import datetime
from dataclasses import asdict
from typing import List, Tuple, Optional
from pydantic import BaseModel

from pydantic import ValidationError
from command.auth.auth_process import AgentAccess
from command.cmd_process import CmdProcess
from util.pi_http.http_handler import HandlerResult, BodyData
from util.log_util import Logger


class NoAuthRequest(BaseModel):
    agent_id: str


class no_auth(CmdProcess):

    def __init__(self):
        super().__init__()

    def _proc(self, body: BodyData, auth_info: pd.DataFrame) -> Tuple[str, HandlerResult, Optional[AgentAccess]]:
        handler_result = HandlerResult()
        agent_access: Optional[AgentAccess] = None
        if isinstance(body, dict):
            validated_request = NoAuthRequest.model_validate(body)
        else:
            validated_request = NoAuthRequest.model_validate_json(body)
        agent_id = validated_request.agent_id
        server_auth_info = auth_info[auth_info['agent_id'] == agent_id]
        if server_auth_info.empty:
            handler_result.status = 401
            handler_result.body = 'agent_id is not valid'
        else:
            handler_result.status = 200
            handler_result.body = {
                'project': server_auth_info['project'].iloc[0],
                'system': server_auth_info['system'].iloc[0]
            }
            agent_access = AgentAccess(server_auth_info['project'].iloc[0],
                                       server_auth_info['system'].iloc[0],
                                       datetime.now())
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
            agent_id, handler_result, agent_access = self._proc(body, inputs[0][1])
            if handler_result.status == 200:
                df_list.append(pd.DataFrame([asdict(agent_access)]))
        except ValidationError as e:
            Logger().log_error(f'no_auth : req_custom_handler : Pydantic validation failed: {e}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except json.JSONDecodeError:
            Logger().log_error(f'no_auth : req_custom_handler : JSON decode failed. Response: {body}')
            handler_result.status = 400
            handler_result.body = 'body is not valid'
        except Exception as e:
            Logger().log_error(f'no_auth : req_custom_handler : exception : {e}')
            handler_result.status = 500
            handler_result.body = f'exception : {e}'
        Logger().log_info(f'no_auth : agent({agent_id}) : response {handler_result.status}, {handler_result.body}')
        return handler_result, df_list
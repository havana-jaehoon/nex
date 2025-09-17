import glob, json, re
from typing import Dict, List, Tuple

import const_def
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from command.cmd_entity import CmdEntity
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger
from util.pi_http.http_handler import HandlerResult, BodyData




class AdminMgr(SingletonInstance):
    def _on_init_once(self):
        self._logger = Logger()

    async def _add(self, exp: re.Match, body: BodyData, kwargs: dict):
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'AdminMgr::_add({exp.span(), body, kwargs})')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_add({exp, body, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _delete(self, exp: re.Match, body: BodyData, kwargs: dict):
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)

            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_del({exp, body, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')
        
    def get_query_handlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            ("/admin/add", self._add, {}),
            ("/admin/delete", self._delete, {})
        ]
        return handler_list

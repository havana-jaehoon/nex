import glob, json, re
from typing import Dict, List, Tuple

#from admin.admin_config import ADMIN_CONFIG_DIR, load_all_config
import const_def
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from command.cmd_entity import CmdEntity
from command.config_reader import ConfigReader, CONFIG_LIST
from command.data_io import DataFileIo

from util.pi_http.http_handler import HandlerArgs, Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger
from util.pi_http.http_handler import HandlerResult, BodyData




class AdminMgr(SingletonInstance):
    def _on_init_once(self):
        self._logger = Logger()
        self.config = ConfigReader("./config_nex/.element/admin")
        self.elements = self.config.getElements('webserver') 

    async def _add(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            #print(f'AdminMgr::_add({handler_args, kwargs})')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_add({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _get(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'AdminMgr::_get({handler_args, kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)


            #cfg = ConfigReader("./config_nex/.element/admin")



            res = {}
            return HandlerResult(status=200, response=res, body=json.dumps(res, indent=2, ensure_ascii=False))
        except Exception as e:
            Logger().log_error(f'AdminMgr::_get({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _set(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'AdminMgr::_set({handler_args, kwargs})')
            print("#######")
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_add({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _delete(self, handler_args: HandlerArgs, kwargs: dict):
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)

            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_del({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')
        
    def get_query_handlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            ("/admin-api/get", self._get, {"cmd_id": "/admin-api/get"}),
            ("/admin-api/set", self._set, {"cmd_id": "/admin-api/set"}),
            ("/admin-api/add", self._add, {"cmd_id": "/admin-api/add"}),
            ("/admin-api/delete", self._delete, {"cmd_id": "/admin-api/delete"})
        ]
        return handler_list

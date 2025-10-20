import inspect
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
        self._rootPath = "./config_nex/.element"
        self._adminPath = f"{self._rootPath}/.system/webserver/admin"

        #self._configList = {v: [] for v in CONFIG_LIST.values()}

        #for key, value in configReader.getDatas().items():
        #self._elements = self._config.getElements('', 'webserver')
        #print(f"AdminMgr::_on_init_once() elements: {self._elements}{self._config}")
        self._loadConfigs()

    def _loadConfigs(self):
        self._cfgReader = ConfigReader(self._adminPath)

        projectName = '' # default project
        systems = self._cfgReader.getSystems(projectName)


        self._configMap = {}  # all projects
        self._dataioMap = {}  # all projects
        self._configMap[projectName] = {} # default project
        self._dataioMap[projectName] = {} # default project

        self._dataioMap[projectName] = {} # default project
        for system in systems:
            systemName = system.get('name', '')

            self._configMap[projectName][systemName] = {}
            self._dataioMap[projectName][systemName] = {}

            # load config data
            configData = {v: [] for v in CONFIG_LIST.values()}
            for key, value in CONFIG_LIST.items():
                if(value == 'element'):
                    configData[value] = self._cfgReader.getDatas(value, projectName, systemName)
                else: # common config
                    configData[value] = self._cfgReader.getDatas(value, projectName, '')
            self._configMap[projectName][systemName] = configData

            #data io for elements
            elementInfoList = self._cfgReader.getElements(projectName, systemName)
            for elementInfo in elementInfoList:
                path = elementInfo['path'] # element path 
                system = elementInfo['system']
                element = elementInfo['element']
                format = elementInfo['format']
                store = elementInfo['store']
                processor = elementInfo['processor']

                dataio = DataFileIo(self._rootPath, path, system, element, format, store, processor)

                self._dataioMap[projectName][systemName][path] = dataio

                data = self._dataioMap[projectName][systemName][path].get()
                print(f"# element data path: {path} data-len: {len(data)}")

                

            #print(f"AdminMgr::_loadConfigs() elements: {elementList}")



    async def _add(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            #print(f'AdminMgr::_add({handler_args, kwargs})')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_add({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _getAdmin(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'AdminMgr::_get({handler_args, kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method

            system = handler_args.query_params.get('system', '')
            project = handler_args.query_params.get('project', '')

            configData = self._configMap.get(project, {}).get(system, None)
            if(configData is None):
                return HandlerResult(status=404, body=f'Not found config for project:{project}, system:{system}')  
                            
            res = json.dumps(configData, indent=2, ensure_ascii=False)
            #print(f"AdminMgr::_get( elements : {res}")

            return HandlerResult(status=200, response=res, body=res)
        except Exception as e:
            Logger().log_error(f'AdminMgr::_get({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')


    async def _getData(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'AdminMgr::_get({handler_args, kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method

            system = handler_args.query_params.get('system', '')
            project = handler_args.query_params.get('project', '')
            path = handler_args.query_params.get('path', '')
            soffset = int(handler_args.query_params.get('soffset', '0'))
            eoffset = int(handler_args.query_params.get('eoffset', '0'))

            dataio = self._dataioMap.get(project, {}).get(system, {}).get(path, None)
            if(dataio is None):
                return HandlerResult(status=404, body=f'Not found dataio for project:{project}, system:{system}, path:{path}')
            
            data = dataio.get(soffset, eoffset)
     
            res = json.dumps(data, indent=2, ensure_ascii=False)
            #print(f"AdminMgr::_get( elements : {res}")

            return HandlerResult(status=200, response=res, body=res)
        except Exception as e:
            Logger().log_error(f'AdminMgr::_get({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')


    async def _uploadData(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            #print(f'AdminMgr::_uploadData({handler_args}, {kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method
            if method != 'POST':
                return HandlerResult(status=405, body='Method Not Allowed, use POST')
            
            body = handler_args.body
            if isinstance(body, str):
                try:
                    body = json.loads(body)
                except Exception:
                    return HandlerResult(status=400, body='Invalid JSON body')

            if not isinstance(body, dict):
                return HandlerResult(status=400, body='Body must be JSON object')

            path = body.get('path', '')
            system = body.get('system', '')
            project = body.get('project', '')
            data = body.get('data', None)

            dataio = self._dataioMap.get(project, {}).get(system, {}).get(path, None)
            #print(f"AdminMgr::_uploadData() - path:{path}, project:{project}, system:{system}, dataio : {dataio}, data : {json.dumps(data, indent=2, ensure_ascii=False)}...")
            if(dataio is None):
                return HandlerResult(status=404, body=f'Not found dataio for project:{project}, system:{system}, path:{path}')
            
            print(f"# uploadData path:{path}, project:{project}, system:{system}, data-len:{len(data)}")

            result = dataio.set(data)
            if inspect.isawaitable(result):
                res = await result
            else:
                res = result


            print(f"# uploadData path:{path}, project:{project}, system:{system}, res:{res}")
            if(res is False):
                return HandlerResult(status=200, response='Success', body='No Data to save data')

            # 성공 응답
            return HandlerResult(status=200, response='Success', body='Success')
        
        except Exception as e:
            Logger().log_error(f'AdminMgr::_uploadData({handler_args}, {kwargs}) : {e}')
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
            ("/admin-api", self._getAdmin, {"cmd_id": "/admin-api"}),
            ("/data-api", self._getData, {"cmd_id": "/admin-api"}),
            ("/data-api/upload", self._uploadData, {"cmd_id": "/upload-api"}),
        ]
        return handler_list


if __name__ == '__main__':
    adminMgr = AdminMgr()
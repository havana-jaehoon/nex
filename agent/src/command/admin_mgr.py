import os
import json
import shutil
from datetime import datetime

from typing import Dict, List, Tuple

#from admin.admin_config import ADMIN_CONFIG_DIR, load_all_config
from generateConfigFromDb import generateConfig
import const_def
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from command.config_reader import ConfigReader, CONFIG_LIST
from command.data_io import DataFileIo

from util.pi_http.http_handler import HandlerArgs, Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger
from util.pi_http.http_handler import HandlerResult, BodyData




class AdminMgr(SingletonInstance):
    def _on_init_once(self):
        self._logger = Logger()

        self.configSystemName = "config"

        self._configPath = f"./.config" # 배포용 경로

        # 데이터 엘리먼트 루트 경로
        self._elementPath = ".element"
        # 데이터 일리먼트 중 admin config 경로
        self._configElementPath = f"{self._elementPath}/.system/{self.configSystemName}/admin"


        self._loadConfigs()

    def __str__(self):
        return f'AdminMgr'    


    def _write_json_file(self, file_path, data):
        try:
            dir_full_path = os.path.dirname(file_path)
            if not os.path.exists(dir_full_path):
                os.makedirs(dir_full_path)            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Error writing JSON file {file_path}: {e}")
        return False

    def _loadConfigs(self):
        self._cfgReader = ConfigReader(self._configPath)

        projectName = '' # default project
        systems = self._cfgReader.getSystems(projectName)


        self._configMap = {}  # all projects
        self._configMap[projectName] = {} # default project

        for system in systems:
            systemName = system.get('name', '')

            self._configMap[projectName][systemName] = {}

            # load config data
            configData = {v: [] for v in CONFIG_LIST.values()}
            for key, value in CONFIG_LIST.items():
                if(value == 'element'):
                    configData[value] = self._cfgReader.getDatas(value, projectName, systemName)
                else: # common config
                    configData[value] = self._cfgReader.getDatas(value, projectName, '')

                #print(f"# system:{systemName}, config:{value}, data-len:{len(configData[value])}")
                #if(value == "system"):
                    #    self._write_json_file(f"./{value}.json", configData[value])
                #    print(f"# system:{systemName}, config:{value}, data:{json.dumps(configData[value], indent=2, ensure_ascii=False)}")

            self._configMap[projectName][systemName] = configData


        #data io for elements
        self._dataioMap = {}  # all projects
        self._dataioMap[projectName] = {} # default project
        elementInfoList = self._cfgReader.getElements(projectName, self.configSystemName)
        for elementInfo in elementInfoList:
            path = elementInfo['path'] # element path 
            system = elementInfo['system']
            storage = elementInfo['storage']
            format = elementInfo['format']
            store = elementInfo['store']
            processor = elementInfo['processor']
            element = elementInfo['element']
    
            dataio = DataFileIo(self._elementPath, path, storage, system, element, format, store, processor)

            self._dataioMap[projectName][path] = dataio

            data = self._dataioMap[projectName][path].get()
            print(f"# element data path: {path} data-len: {len(data)}")

                




    async def _add(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            #print(f'AdminMgr::_add({handler_args, kwargs})')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_add({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _getConfig(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'{self.__str__()}::_get({handler_args, kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method

            system = handler_args.query_params.get('system', '')
            project = handler_args.query_params.get('project', '')

            configData = self._configMap.get(project, {}).get(system, None)
            if(configData is None):
                return HandlerResult(status=404, body=f'Not found config for project:{project}, system:{system}')  
                            
            res = json.dumps(configData, indent=2, ensure_ascii=False)
            #print(f"{self.__str__()}::_get( elements : {res}")

            return HandlerResult(status=200, response=res, body=res)
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_getAdmin({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')


    async def _getData(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'{self.__str__()}::_get({handler_args, kwargs})')
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method

            system = handler_args.query_params.get('system', '')
            project = handler_args.query_params.get('project', '')
            path = handler_args.query_params.get('path', '')
            soffset = int(handler_args.query_params.get('soffset', '0'))
            eoffset = int(handler_args.query_params.get('eoffset', '0'))

            if(system != self.configSystemName):
                return HandlerResult(status=400, body=f'Invalid system name for getData: {system}, must be {self.configSystemName}')

            dataio = self._dataioMap.get(project, {}).get(path, None)
            if(dataio is None):
                return HandlerResult(status=404, body=f'Not found dataio for project:{project}, system:{system}, path:{path}')
            
            data = dataio.get(soffset, eoffset)
     
            res = json.dumps(data, indent=2, ensure_ascii=False)
            #print(f"AdminMgr::_get( elements : {res}")

            return HandlerResult(status=200, response=res, body=res)
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_getData({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')



    async def _cmdData(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            #print(f"# Root-Path : {ADMIN_CONFIG_DIR}")
            #res = load_all_config(ADMIN_CONFIG_DIR)
            method = handler_args.method

            
            full_path = handler_args.full_path
            # full_path 에서 /data-api 제거
            path = full_path[len('/data-api'):]
            project = handler_args.query_params.get('project', '')
            cmd = handler_args.query_params.get('cmd', '')

            dataio = self._dataioMap.get(project, {}).get(path, None)
            if dataio is None:
                return HandlerResult(status=404, body=f'Not found dataio for project:{project}, path:{path}')

            print(f'{self.__str__()}::_cmdData: method:{method}, project:{project}, path:{path}')

            if method == 'GET': # get command -> get
                # Handle GET request
                soffset = int(handler_args.query_params.get('soffset', '0'))
                eoffset = int(handler_args.query_params.get('eoffset', '0'))

                return HandlerResult(status=200, body=json.dumps(dataio.get(soffset, eoffset), indent=2, ensure_ascii=False))

            elif method == 'POST': # post command -> add
                # Handle POST request
                print(f'{self.__str__()}::_cmdData-POST:({handler_args, kwargs})')

                data = handler_args.body
                bres, msg = dataio.add(data)
                print(f'{self.__str__()}::_cmdData-POST: add result: {bres}, msg:{msg}')
                if bres is False:
                    return HandlerResult(status=400, body=f'Failed to add data: {msg}')

                return HandlerResult(status=200, body=json.dumps(dataio.get(), indent=2, ensure_ascii=False))

            elif method == 'PUT': # put command -> update
                # Handle PUT request
                keys = []
                try:
                    keys = json.loads(handler_args.query_params.get('keys', '[]'))
                except json.JSONDecodeError:
                    return HandlerResult(status=400, body=f"Invalid JSON in 'keys' parameter: {keys}")

                if cmd == 'select':
                    print(f'{self.__str__()}::_cmdData-SELECT:({handler_args, kwargs})')

                    return HandlerResult(status=200, body=f"Not implemented select command yet")
                elif cmd == "update":
                    data = handler_args.body         
                    bres, msg = dataio.update(data)
                    print(f'{self.__str__()}::_cmdData-PUT: update result: {bres}, msg:{msg}')
                    if bres is False:
                        return HandlerResult(status=400, response=f'Failed to update data: {msg}', body=f'Failed to update data: {msg}')
                    
                    return HandlerResult(status=200, body=json.dumps(dataio.get(), indent=2, ensure_ascii=False))
                else:
                    return HandlerResult(status=400, body=f'Unknown cmd for PUT method command: {cmd}')

            elif method == 'DELETE': # delete command -> remove
                # Handle DELETE request
                print(f'{self.__str__()}::_cmdData-DELETE:({handler_args, kwargs})')

                keys = []
                try:
                    keys = json.loads(handler_args.query_params.get('keys', '[]'))
                except json.JSONDecodeError:
                    return HandlerResult(status=400, body=f"Invalid JSON in 'keys' parameter: {keys}")

                bres, msg = dataio.delete(keys)
                if bres is False:
                    return HandlerResult(status=400, body=f'Failed to delete data: {msg}')

                return HandlerResult(status=200, body=json.dumps(dataio.get(), indent=2, ensure_ascii=False))

            else:
                return HandlerResult(status=405, body='Method Not Allowed, use GET, POST, PUT, DELETE')

        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_cmdData({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _set(self, handler_args: HandlerArgs, kwargs: dict)-> HandlerResult:
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)
            print(f'{self.__str__()}::_set({handler_args, kwargs})')
            print("#######")
            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_set({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _delete(self, handler_args: HandlerArgs, kwargs: dict):
        try:
            # execute processor
            #handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)

            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_delete({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')


    def _backupConfig(self):
        try:
            # self._configElementPath, self._configPath
            # 1. self._configPath  경로를 백업 
            # 예 : ./.config_20231010_153000
            now = datetime.now()
            timestamp = now.strftime("%Y%m%d_%H%M%S")
            backupDir = f"{self._configPath}_{timestamp}"

            shutil.copytree(self._configPath, backupDir)
            return True
        except Exception as e:
            return False

    async def _distribution(self, handler_args: HandlerArgs, kwargs: dict):
        try:
            # self._configElementPath, self._configPath
            # 1. self._configPath  경로를 백업 
            # 예 : ./.config_20231010_153000

            self._backupConfig()

            # 2. self._adm
            # inElementPath 경로를 self._configPath 로 복사
            shutil.copytree(self._configElementPath, self._configPath, dirs_exist_ok=True)

            # 3. 데이터 재로딩
            self._loadConfigs()

            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'{self.__str__()}::_distribution({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _genDbElement(self, handler_args: HandlerArgs, kwargs: dict):
        try:
            #configSystemName = "webserver"
            # 1. get params
            method = handler_args.method
            system = handler_args.query_params.get('system', '') # system name
            project = handler_args.query_params.get('project', '') # project name
            storage = handler_args.query_params.get('storage', '') # storage name

            print(f'AdminMgr::_genDbElement(project={project}, system={system}, storage={storage})')

            # 2. self._configMap 로 부터 storage(이름==storage) object 구하기
            configData = self._configMap.get(project, {}).get(self.configSystemName, None)
            if(configData is None):
                return HandlerResult(status=404, body=f'Not found config for project:{project}, system:{system}')

            storageList = configData.get('storage', [])

            storageInfo = None
            for entry in storageList:
                if len(entry) < 5:
                    continue
                wrapper = entry[4]
                if not isinstance(wrapper, dict):
                    continue
                for _, info in wrapper.items():
                    if info.get('name') == storage:
                        storageInfo = info
                        break
                if storageInfo is not None:
                    break

            if storageInfo is None:
                return HandlerResult(status=404, body=f'Not found storage config for project:{project}, system:{system}, storage:{storage}')


            # 3.  storageInfo 를 이용해 format, store, processor, element 정보 생성
            #output = generate_element_output(storageInfo)
            output = generateConfig(storageInfo)
            print(f"AdminMgr::_loadDb: generated config: {json.dumps(output.get('format', []), indent=2, ensure_ascii=False)}")
            #output = { "format": [], "store": [], "element": [] }

            # 4. output 데이터의 format, store, element
            # Element Paht 가 /admin/format, /admin/store, /admin/element 인 DataIo 에 Add


            formatDataio = self._dataioMap.get(project, {}).get("/admin/format", None)
            #storeDataio = self._dataioMap.get(project, {}).get(system, {}).get("/admin/store", None)
            elementDataio = self._dataioMap.get(project, {}).get("/admin/element", None)
            if formatDataio is None or elementDataio is None:
                return HandlerResult(status=404, body=f'Not found admin dataio for project:{project}, system:{system}')


            root_path = f"/.ext/{storage}"
            item = [-1, "/.ext", project, "", {"-1" : {
                "name": ".ext",
                "dispName": "외부데이터",
                "description": "외부데이터",
                "type": "folder",
                "icon": "",
                "color": ""
            }}]
            bres, response = formatDataio.add(item)
            if bres is False:
                err = f'Failed to add format folder: {response}'
                Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')

            item = [-1, f"/.ext/{storage}", project, "", {"-1" : {
                "name": storage,
                "dispName": f"{storageInfo.get('dispName', storage)}",
                "description": f"{storageInfo.get('description', storage)}",
                "type": "folder",
                "icon": "",
                "color": ""
            }}]
            bres, response = formatDataio.add(item)
            if bres is False:
                err = f'Failed to add format storage folder: {response}'
                Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')

            item = [-1, "/.ext", project, system, {"-1" : {
                "name": ".ext",
                "dispName": "외부데이터",
                "description": "외부데이터",
                "type": "folder",
                "icon": "",
                "color": ""
            }}]
            bres, response = elementDataio.add(item)
            if bres is False:
                err = f'Failed to add element folder: {response}'
                Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')

            item = [-1, f"/.ext/{storage}", project, system, {"-1" : {
                "name": storage,
                "dispName": f"{storageInfo.get('dispName', storage)}",
                "description": f"{storageInfo.get('description', storage)}",
                "type": "folder",
                "icon": "",
                "color": ""
            }}]
            bres, response = elementDataio.add(item)
            if bres is False:
                err = f'Failed to add element storage folder: {response}'
                Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')
                

            index = 0
            for fmt in output['format']:
                path = f"{root_path}/{fmt.get('name', f'unknown_{index}')}"
                item = [ -1, path, project, "", {"-1": fmt} ]                    
                bres, response = formatDataio.add(item)
                if bres is False:
                    err = f'Failed to add format data: {response}'
                    Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')
                index += 1
                
            index = 0
            for elem in output['element']:
                path = f"{root_path}/{elem.get('name', f'unknown_{index}')}"
                # 변환 로직 예시
                #elem_conv = dict(elem)

                # 예: format 값을 element 경로(path)로 치환
                elem['format'] = path
                elem['storage'] = f"/{storage}"

                item = [ -1, path, project, system, {"-1": elem} ]
                bres, response = elementDataio.add(item)
                if bres is False:
                    err = f'Failed to add element data: {response}'
                    Logger().log_error(f'{self.__str__()}::_genDbElement() : {err}')
                index += 1

            return HandlerResult(status=200, body='success')
        except Exception as e:
            Logger().log_error(f'AdminMgr::_loadDb({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    def get_query_handlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            ("/config-api", self._getConfig, {"cmd_id": "/admin-api"}),
            ("/data-api", self._cmdData, {"cmd_id": "/data-api"}),
            ("/cmd-api/dist", self._distribution, {"cmd_id": "/cmd-api/dist"}),
            ("/cmd-api/gen-db-element", self._genDbElement, {"cmd_id": "/cmd-api/gen-db-element"}),
            
        ]
        return handler_list

if __name__ == '__main__':
    adminMgr = AdminMgr()
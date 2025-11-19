import copy, json
from readerwriterlock import rwlock
from typing import List, Tuple

import url_def
from config.element_cfg import ElementCfgs
from config.system_cfg import SystemCfg
from config.config_base_mgr import ConfigBaseMgr
from auth.auth_server import AuthServer
from system_info import SystemInfoMgr
from command.data_io import ELEMENT_CFG_LIST
from command.config_reader import ConfigReader
from util.pi_http.http_handler import Server_Dynamic_Handler, HandlerArgs, HandlerResult


class ConfigServerMgr(ConfigBaseMgr):

    SYSTEM_NAME = 'config'

    def _on_init_once(self, **kwargs):
        super()._on_init_once(**kwargs)
        self._auth:AuthServer = AuthServer(SystemInfoMgr().config_dir,
                                           SystemInfoMgr().src_dir,
                                           SystemInfoMgr().projectName,
                                           ConfigServerMgr.SYSTEM_NAME,
                                           SystemInfoMgr().secretKey,
                                           'token_jwt')
        self._systemDataMapRWLock = rwlock.RWLockFairD()
        self._systemDataMapRLock = self._systemDataMapRWLock.gen_rlock()
        self._systemDataMapWLock = self._systemDataMapRWLock.gen_wlock()
        self._systemDataMap = {}
        self._cfgReader = ConfigReader(SystemInfoMgr().admin_data_dir)

    def _loadSystemConfig(self):
        try:
            self._logger.log_info(f'ConfigServerMgr : loadSystemConfig : start')

            # check update ????

            if self._systemCfg.load():
                self._logger.log_info(f'ConfigServerMgr : loadSystemConfig : load success')
            else:
                systems = self._cfgReader.getSystems('')
                if not self._systemCfg.init(systems):
                    raise Exception('system-cfg init fail')
                self._logger.log_info(f'ConfigServerMgr : loadSystemConfig : init success')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : loadSystemConfig : fail to {e}')
            raise Exception(f'ConfigServerMgr : loadSystemConfig fail to {e}')

    def _loadSystemData(self):
        try:
            self._logger.log_info(f'ConfigServerMgr : loadSystemData : start')
            system_dataMap = {}
            systems = self._cfgReader.getSystems('')
            for system in systems:
                system_name = system.get('name')
                if not system_name:
                    continue
                if system_name == self._auth.systemName:
                    continue

                # load config of system
                system_data = { v: [] for v in ELEMENT_CFG_LIST.values() }
                for key, value in ELEMENT_CFG_LIST.items():
                    if value == ELEMENT_CFG_LIST['ELEMENT']:
                        system_data[value] = self._cfgReader.getDatas(value, '', system_name)
                    elif value == ELEMENT_CFG_LIST['SYSTEM']:
                        system_data[value] = systems
                        # temp_data = self._cfgReader.getDatas(value, '', '')
                        # system_data[value] = [
                        #     v
                        #     for item in temp_data
                        #     if isinstance(item, list) and len(item) > 4 and isinstance(item[-1], dict)
                        #     for v in item[-1].values()
                        # ]
                    else:
                        system_data[value] = self._cfgReader.getDatas(value, '', '')
                system_dataMap[system_name] = system_data
        except Exception as e:
            import traceback
            tb_str = traceback.format_exc()
            self._logger.log_error(f'ConfigServerMgr : loadSystemData : fail to {tb_str}')
            raise Exception(f'ConfigServerMgr : loadSystemData fail to {tb_str}')
        else:
            with self._systemDataMapWLock:
                self._systemDataMap = system_dataMap
                self._logger.log_info(f'ConfigServerMgr : loadSystemData : load success')

    def _loadOwnConfig(self):
        try:
            self._logger.log_info(f'ConfigServerMgr : loadOwnConfig : start')

            # check update ????

            if self._elementCfgs.load():
                self._logger.log_info(f'ConfigServerMgr : loadOwnConfig : load success')
            else:
                with open(self._auth.getInternalElementConfigFile(), 'r', encoding='utf-8') as f:
                    auth_internal_element_config_data = json.load(f)
                if not self._elementCfgs.init(auth_internal_element_config_data, self._systemCfg.getSystemConfig(self._auth.systemName), True):
                    raise Exception('element-cfg init fail')
                self._logger.log_info(f'ConfigServerMgr : loadOwnConfig : init success')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : loadOwnConfig : fail to {e}')
            raise Exception(f'ConfigServerMgr : loadOwnConfig fail to {e}')

    def _getSystemData(self, system_name: str) -> dict:
        with self._systemDataMapRLock:
            return copy.deepcopy(self._systemDataMap.get(system_name, {}))

    async def _get(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            if handler_args.method != 'GET':
                self._logger.log_error(f'ConfigServerMgr : config query : invalid method')
                return HandlerResult(status=405, body=f'invalid method')
            project = handler_args.query_params.get('project', '')
            system = handler_args.query_params.get('system', '')
            self._logger.log_info(f'ConfigServerMgr : {project}, {system} : config query : start')
            if not await self._auth.isAccess(project, system, handler_args.client_ip):
                self._logger.log_error(f'ConfigServerMgr : {project}, {system} : config query : not found access')
                return HandlerResult(status=403, body=f'invalid access')
            system_data = self._getSystemData(system)
            if system_data:
                self._logger.log_info(f'ConfigServerMgr : {project}, {system} : config query : success')
                return HandlerResult(status=200, body=system_data)
            else:
                self._logger.log_error(f'ConfigServerMgr : {project}, {system} : config query : not found config')
                return HandlerResult(status=404, body=f'Not found config for project:{project}, system:{system}')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : config query ({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def _adminDataRefresh(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            self._logger.log_info(f'ConfigServerMgr : admin-data refresh : start')
            self._loadSystemData()
            self._logger.log_info(f'ConfigServerMgr : admin-data refresh : success')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : admin-data refresh ({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')


    def start(self):
        self._logger.log_info(f'ConfigServerMgr : start')
        # start auth
        if self._auth.load():
            self._logger.log_info(f'ConfigServerMgr : auth-server load success')
        else:
            if self._auth.init():
                self._logger.log_info(f'ConfigServerMgr : auth-server init success')
            else:
                raise Exception('auth-server init fail')

        # start config
        self._systemCfg = SystemCfg(SystemInfoMgr().config_dir)
        self._elementCfgs = ElementCfgs(SystemInfoMgr().config_dir, self._auth.systemName)
        self._loadSystemConfig()
        self._loadSystemData()
        self._loadOwnConfig()

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            (url_def.AGENT_CONFIG_QUERY_SUB_URL,    self._get,                      {}),
            (url_def.ADMIN_CONFIG_REFRESH,          self._adminDataRefresh,         {})
        ]
        handler_list.extend(self._auth.getQueryHandlers())
        return handler_list

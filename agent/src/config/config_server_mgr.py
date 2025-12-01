import copy, json
from enum import Enum, auto
from dataclasses import dataclass, field
from readerwriterlock import rwlock
from typing import List, Tuple, Dict, Optional

import url_def
from api.api_proc import HttpReqMgr
from config.element_cfg import ElementCfgs
from config.system_cfg import SystemCfg
from config.config_base_mgr import ConfigBaseMgr
from auth.auth_server import AuthServer
from system_info import SystemInfoMgr
from command.data_io import ELEMENT_CFG_LIST
from command.config_reader import ConfigReader
from util.dict_util import DictUtil
from util.pi_http.http_handler import Server_Dynamic_Handler, HandlerArgs, HandlerResult
from util.message_queue import MessageQueueWorker


class MessageType(Enum):
    ADMIN_REFRESH = auto()


@dataclass
class MessageQueueData:
    messageType: MessageType
    messageBody: dict = field(default_factory=dict)

    def __str__(self):
        return f'msg-type={self.messageType}'


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
        self._systemDataMap: Dict[str, Dict[str, List[dict]]] = {}      # { system_name: { config_type: [config_data] }
        self._cfgReader = ConfigReader(SystemInfoMgr().admin_data_dir)
        self._messageQThread = MessageQueueWorker[MessageQueueData](self._messageQHandler)
        self._messageQThread.start()

    def _initSystemConfig(self):
        try:
            self._logger.log_info(f'ConfigServerMgr : initSystemConfig : start')
            systems = self._cfgReader.getSystems('')
            if not self._systemCfg.init(systems):
                raise Exception('system-cfg init fail')
            self._logger.log_info(f'ConfigServerMgr : initSystemConfig : success')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : initSystemConfig : fail to {e}')
            raise Exception(f'ConfigServerMgr : initSystemConfig fail to {e}')

    def _applyAllSystemData(self, new_system_data: Dict[str, Dict[str, List[dict]]]):
        with self._systemDataMapRWLock.gen_wlock():
            self._systemDataMap = new_system_data
            self._logger.log_info(f'ConfigServerMgr : applyAllSystemData : success')

    @staticmethod
    def _getAllSystemData(own_system_name: str, config_reader: Optional[ConfigReader]=None) -> Dict[str, Dict[str, List[dict]]]:
        try:
            system_dataMap:Dict[str, Dict[str, List[dict]]] = {}
            if not config_reader:
                config_reader = ConfigReader(SystemInfoMgr().admin_data_dir)
            systems = config_reader.getSystems('')
            for system in systems:
                system_name = system.get('name')
                if not system_name:
                    continue
                if system_name == own_system_name:
                    continue

                # load config of system
                system_data = { v: [] for v in ELEMENT_CFG_LIST.values() }
                for key, value in ELEMENT_CFG_LIST.items():
                    if value == ELEMENT_CFG_LIST['ELEMENT']:
                        system_data[value] = config_reader.getDatas(value, '', system_name)
                    elif value == ELEMENT_CFG_LIST['SYSTEM']:
                        system_data[value] = systems
                    else:
                        system_data[value] = config_reader.getDatas(value, '', '')
                system_dataMap[system_name] = system_data
            return system_dataMap
        except Exception as e:
            import traceback
            tb_str = traceback.format_exc()
            raise Exception(f'ConfigServerMgr : getAllSystemData fail to {tb_str}')

    def _initOwnConfig(self):
        try:
            self._logger.log_info(f'ConfigServerMgr : initOwnConfig : start')
            if self._elementCfgs.load():
                self._logger.log_info(f'ConfigServerMgr : initOwnConfig : success (load)')
            else:
                with open(self._auth.getInternalElementConfigFile(), 'r', encoding='utf-8') as f:
                    auth_internal_element_config_data = json.load(f)
                if not self._elementCfgs.init(auth_internal_element_config_data, self._systemCfg.getSystemConfig(self._auth.systemName), True):
                    raise Exception('element-cfg init fail')
                self._logger.log_info(f'ConfigServerMgr : initOwnConfig : success (init)')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : initOwnConfig : fail to {e}')
            raise Exception(f'ConfigServerMgr : initOwnConfig fail to {e}')

    def _findChangedSystemConfig(self, new_admin_data: Dict[str, Dict[str, List[dict]]]) -> List[Tuple[str, Dict[str, List[dict]]]]:
        change_system_list:List[Tuple[str, Dict[str, List[dict]]]] = []
        for system_name, new_system_data in new_admin_data.items():
            if system_name not in self._systemDataMap:
                self._logger.log_info(f'ConfigServerMgr : findNewSystemConfig : {system_name} is new')
                changed = True
            else:
                old_system_data = self._systemDataMap.get(system_name, {})
                if DictUtil.deep_equal_ignore_order(old_system_data, new_system_data):
                    self._logger.log_info(f'ConfigServerMgr : findNewSystemConfig : {system_name} is not changed')
                    changed = False
                else:
                    self._logger.log_info(f'ConfigServerMgr : findNewSystemConfig : {system_name} is changed')
                    changed = True
            if changed:
                change_system_list.append((system_name, new_system_data))
        return change_system_list

    def _getSystemData(self, system_name: str) -> dict:
        with self._systemDataMapRWLock.gen_rlock():
            return copy.deepcopy(self._systemDataMap.get(system_name, {}))

    def _procAdminDataRefresh(self):
        new_all_system_data: Dict[str, Dict[str, List[dict]]] = self._getAllSystemData(self._auth.systemName)
        change_system_list: List[Tuple[str, Dict[str, List[dict]]]] = self._findChangedSystemConfig(new_all_system_data)
        self._applyAllSystemData(new_all_system_data)
        self._initSystemConfig()
        post_args_list = []
        for system_name, changed_system_data in change_system_list:
            access_info = self._auth.getAccessSync(system_name)
            if access_info:
                addr = self._systemCfg.getSystemAddress(system_name)
                if addr:
                    ip = addr[0]
                    port = addr[1]
                    post_args_list.append((ip, port, url_def.AGENT_CONFIG_UPDATE, changed_system_data, None))
                    self._logger.log_info(f'ConfigServerMgr : findNewSystemConfig : {system_name} found access : SystemAddr={ip}/{port}, AccessAddr={access_info.ip}')
            else:
                self._logger.log_info(f'ConfigServerMgr : findNewSystemConfig : {system_name} not found access')
        HttpReqMgr().postMany(post_args_list)

    def _messageQHandler(self, msg: MessageQueueData):
        try:
            self._logger.log_info(f'ConfigServerMgr : queue-Handler : start')
            self._logger.log_info(f'ConfigServerMgr : queue-Handler : message ({msg})')
            if msg.messageType == MessageType.ADMIN_REFRESH:
                self._procAdminDataRefresh()
            self._logger.log_info(f'ConfigServerMgr : queue-Handler : success')
        except Exception as e:
            import traceback
            tb_str = traceback.format_exc()
            self._logger.log_error(f'ConfigServerMgr : queue-Handler : exception : {e} : {tb_str}')

    async def _rcvReq4ConfigQuery(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            if handler_args.method != 'GET':
                self._logger.log_error(f'ConfigServerMgr : config query : invalid method')
                return HandlerResult(status=405, body=f'invalid method')
            project = handler_args.query_params.get('project', '')
            system = handler_args.query_params.get('system', '')
            self._logger.log_info(f'ConfigServerMgr : {project}, {system} : config query : start')
            if not await self._auth.getAccessAsync(system, project, handler_args.client_ip):
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

    async def _rcvReq4RefreshAdminData(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            if handler_args.method != 'POST':
                self._logger.log_error(f'ConfigServerMgr : Refresh Admin-Data : invalid method')
                return HandlerResult(status=405, body=f'invalid method')
            self._logger.log_info(f'ConfigServerMgr : admin-data refresh : start')
            self._messageQThread.put(MessageQueueData(messageType=MessageType.ADMIN_REFRESH, messageBody={}))
            self._logger.log_info(f'ConfigServerMgr : admin-data refresh : success')
            return HandlerResult(status=200, body='success')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : admin-data refresh ({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    def start(self):
        self._logger.log_info(f'ConfigServerMgr : start')
        if self._auth.init():
            self._logger.log_info(f'ConfigServerMgr : auth-server init success')
        else:
            raise Exception('auth-server init fail')

        # start config
        self._systemCfg = SystemCfg(SystemInfoMgr().config_dir)
        self._elementCfgs = ElementCfgs(SystemInfoMgr().config_dir, self._auth.systemName)
        self._applyAllSystemData(self._getAllSystemData(self._auth.systemName, self._cfgReader))
        self._initSystemConfig()
        self._initOwnConfig()

    def stop(self):
        self._messageQThread.wait_until_done()
        self._messageQThread.stop()

    def getLocalAddress(self) -> Optional[Tuple[str, int]]:
        return SystemInfoMgr().configServerIp, SystemInfoMgr().configServerPort

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            (url_def.AGENT_CONFIG_QUERY,            self._rcvReq4ConfigQuery,           {}),
            (url_def.ADMIN_CONFIG_REFRESH,          self._rcvReq4RefreshAdminData,      {})
        ]
        handler_list.extend(self._auth.getQueryHandlers())
        return handler_list

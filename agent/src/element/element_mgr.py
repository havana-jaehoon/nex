import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from apscheduler.schedulers.background  import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from readerwriterlock import rwlock

import mgr_registry
from config.element_cfg import ElementCfg, ElementCfgs
from element.element_entity import ElementEntity
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class ElementMgr(SingletonInstance):

    def _on_init_once(self):
        self._logger = Logger()
        self._scheduler = BackgroundScheduler(timezone='Asia/Seoul')
        self._scheduler.add_executor(ThreadPoolExecutor(max_workers=20))
        self._elements: Dict[str, ElementEntity] = {}   # key: element_id
        self._elementMapRWLock = rwlock.RWLockFairD()

    def _addElement(self, element_cfg: ElementCfg):
        element_entity = ElementEntity(element_cfg, self._scheduler)
        self._elements[element_entity.id] = element_entity

    def start(self):
        self._scheduler.start()

    def stop(self):
        if self._scheduler.running:
            self._scheduler.shutdown()

    def addElement(self, element_cfg: ElementCfg):
        with self._elementMapRWLock.gen_wlock():
            element_entity = ElementEntity(element_cfg, self._scheduler)
            self._elements[element_entity.id] = element_entity
            self._logger.log_info(f'Element is registered: {element_entity.id}')

    def reloadElementCfgs(self, element_cfgs: ElementCfgs):
        with self._elementMapRWLock.gen_wlock():
            add_list = []
            del_list = []
            for element_cfg in element_cfgs.getElementConfigList():
                element_entity = self._elements.get(element_cfg.id)
                if element_entity:
                    element_entity.applyConfig(element_cfg, self._scheduler)
                else:
                    add_list.append(element_cfg)
            for element_id in self._elements.keys():
                if not element_cfgs.isExistElementCfg(element_id):
                    del_list.append(element_id)
            for element_id in del_list:
                mgr_registry.HTTP_SERVER.del_dynamic_rule(self._elements[element_id].url)
                self._elements[element_id].stop()
                del self._elements[element_id]
                self._logger.log_info(f'Element is deleted: {element_id}')
            for element_cfg in add_list:
                self._addElement(element_cfg)
                query_handler, kwargs = self._elements[element_cfg.id].getQueryHandler()
                mgr_registry.HTTP_SERVER.add_dynamic_rule(element_cfg.url, query_handler, kwargs)
                self._logger.log_info(f'Element is added: {element_cfg.id}')

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        with self._elementMapRWLock.gen_rlock():
            return_list = []
            for element in self._elements.values():
                handler, kwargs = element.getQueryHandler()
                return_list.append((element.url, handler, kwargs))
            return return_list

    async def getDataAsync(self, element_id: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        with self._elementMapRWLock.gen_rlock():
            element = self._elements.get(element_id, None)
            if element:
                return await element.getDataAsync(filters, columns)
            else:
                return pd.DataFrame()

    def getDataSync(self, element_id: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        with self._elementMapRWLock.gen_rlock():
            element = self._elements.get(element_id, None)
            if element:
                return element.getDataSync(filters, columns)
            else:
                return pd.DataFrame()

    def setData(self, element_id: str, data: pd.DataFrame):
        with self._elementMapRWLock.gen_rlock():
            element = self._elements.get(element_id, None)
            if element:
                element.setData(data)

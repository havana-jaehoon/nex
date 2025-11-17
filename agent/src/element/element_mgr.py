import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from apscheduler.schedulers.background  import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

from config.element_cfg import ElementCfg
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

    def start(self):
        self._scheduler.start()

    def stop(self):
        if self._scheduler.running:
            self._scheduler.shutdown()

    def addElement(self, element_cfg: ElementCfg):
        element_entity = ElementEntity(element_cfg)
        element_entity.register_interval(self._scheduler)
        self._elements[element_entity.id] = element_entity
        self._logger.log_info(f'Element is registered: {element_entity.id}')

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        return_list = []
        for element in self._elements.values():
            handler, kwargs = element.getQueryHandler()
            return_list.append((element.url, handler, kwargs))
        return return_list

    async def getData(self, element_id: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        element = self._elements.get(element_id, None)
        if element:
            return await element.getDataAsync(filters, columns)
        else:
            return pd.DataFrame()

    def setData(self, element_id: str, data: pd.DataFrame):
        element = self._elements.get(element_id, None)
        if element:
            element.setData(data)

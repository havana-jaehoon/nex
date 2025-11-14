from abc import ABC, abstractmethod
from typing import Optional, Tuple, List, Generator

from config.element_cfg import ElementCfgs, ElementCfg
from config.system_cfg import SystemCfg
from auth.auth_base import AuthBase
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class ConfigBaseMgr(ABC, SingletonInstance):

    def _on_init_once(self, **kwargs):
        self._logger = Logger()
        self._auth: Optional[AuthBase] = None
        self._systemCfg: Optional[SystemCfg] = None
        self._elementCfgs: Optional[ElementCfgs] = None

    def getLocalAddress(self) -> Optional[Tuple[str, int]]:
        return self._systemCfg.getSystemAddress(self._auth.systemName)

    def getSystemAddress(self, system_name: str) -> Optional[Tuple[str, int]]:
        return self._systemCfg.getSystemAddress(system_name)

    def getElementConfigList(self) -> Generator[ElementCfg, None, None]:
        return self._elementCfgs.getElementConfigList()

    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        pass

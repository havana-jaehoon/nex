import os, json, threading, copy
from typing import List, Dict, Tuple, Optional

from util.log_util import Logger


class SystemCfg:

    def __init__(self, base_dir: str, config_name: str = 'config'):
        self._logger = Logger()
        self._apiLock = threading.Lock()
        self._systemCfgMap: Dict[str, dict] = {}   # key: system_name, value: system config
        self._systemCfgFilePath = f'{base_dir}/{config_name}/.system.json'

    def _deleteAllFiles(self):
        if os.path.exists(self._systemCfgFilePath):
            os.remove(self._systemCfgFilePath)
            Logger().log_info(f'System Config File all removed')

    def _reset(self):
        self._systemCfgMap.clear()

    def load(self) -> bool:
        if not os.path.exists(self._systemCfgFilePath):
            return False

        with self._apiLock:
            try:
                self._reset()
                with open(self._systemCfgFilePath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._systemCfgMap = { system_dict['name']: system_dict for system_dict in data }
                self._logger.log_info(f'SystemCfg : load')
                return True
            except Exception as e:
                self._logger.log_error(f'SystemCfg : init : fail to {e}')
                return False

    def init(self, all_system_config_list: List[dict]) -> bool:
        with self._apiLock:
            try:
                self._deleteAllFiles()
                self._reset()
                self._systemCfgMap = { system_dict['name']: system_dict for system_dict in all_system_config_list }
                with open(self._systemCfgFilePath, 'w', encoding='utf-8') as f:
                    json.dump(all_system_config_list, f, indent=4, ensure_ascii=False)
                self._logger.log_info(f'SystemCfg : init')
                return True
            except Exception as e:
                self._logger.log_error(f'SystemCfg : loadAll : fail to {e}')
                return False

    def getAllSystemConfig(self) -> Dict[str, dict]:
        with self._apiLock:
            return copy.deepcopy(self._systemCfgMap)

    def getSystemConfig(self, system_name: str) -> Optional[dict]:
        with self._apiLock:
            return copy.deepcopy(self._systemCfgMap.get(system_name, None))

    def getSystemAddress(self, system_name: str) -> Optional[Tuple[str, int]]:
        with self._apiLock:
            system_cfg = self._systemCfgMap.get(system_name, None)
            if system_cfg:
                system_address_dict = system_cfg.get('address', {})
                return system_address_dict.get('ip', ''), int(system_address_dict.get('port', '0'))
            else:
                return None

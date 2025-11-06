import pandas as pd
from configparser import ConfigParser
from typing import Dict, List, Optional, Any

from store.storage_imp.oracle import OracleStorage
from store.storage import Storage, StorageType
from util.scheme_define import SchemaDefinition
from util.singleton import SingletonInstance
from util.log_util import Logger


class StoreMgr(SingletonInstance):

    def _on_init_once(self, storage_cfg_path: str):
        self._logger = Logger()

        # storage
        config = ConfigParser()
        config.read(storage_cfg_path, encoding='utf-8')
        self._storage_dict: Dict[str, Storage] = {}     #key: storage_name, value: storage
        for section in config.sections():
            storage = self._createStorage(dict(config.items(section)))
            if storage is None:
                raise Exception(f'StoreMgr : fail to create storage : {section} is not valid')
            self._storage_dict[section] = storage
            self._logger.log_info(f'Storage is registered. {section}={storage})')

    @staticmethod
    def _createStorage(storage_cfg: dict) -> Storage:
        if storage_cfg.get('type', '').upper() == StorageType.ORACLE:
            return OracleStorage(storage_cfg)
        else:
            raise None

    def applyScheme(self, storage_name: str, schema: SchemaDefinition) -> bool:
        storage = self._storage_dict.get(storage_name, None)
        return storage.applySchema(schema) if storage else False

    def setData(self, storage_name: str, schema_name: str, data: pd.DataFrame, chunk_size: int, enable_upsert: bool):
        storage = self._storage_dict.get(storage_name, None)
        storage.setData(schema_name, data, chunk_size, enable_upsert)

    def getData(self, storage_name: str, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        storage = self._storage_dict.get(storage_name, None)
        return storage.getData(schema_name, filters, columns)

    async def getDataAsync(self, storage_name: str, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        storage = self._storage_dict.get(storage_name, None)
        return await storage.getDataAsync(schema_name, filters, columns)

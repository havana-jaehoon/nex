import pandas as pd
from typing import List, Dict, Optional, Any

from store.storage import Storage
from store.store_cfg import StoreConfig
from util.scheme_define import SchemaDefinition
from util.log_util import Logger


class StoreEntity:
    def __init__(self, folder_tree:List[str], store_cfg: dict):
        self._store_cfg = StoreConfig(folder_tree, store_cfg)
        self._storage = None
        self._logger = Logger()

    def __str__(self):
        return f'StoreEntity({self._store_cfg})'

    def set_storage(self, storage_dict: Dict[str, Storage]) -> bool:
        if self._store_cfg.storage_name in storage_dict:
            self._storage = storage_dict[self._store_cfg.storage_name]
            return True
        else:
            return False

    def apply_schema(self, schema: SchemaDefinition):
        self._storage.apply_schema(schema)

    def get_id(self) -> str :
        return self._store_cfg.id

    def set_data(self, schema_name: str, data: pd.DataFrame):
        if not self._storage:
            raise Exception(f'StoreEntity({self._store_cfg.id}) : set_data : Storage is not set')
        self._logger.log_info(f'StoreEntity({self._store_cfg.id}) : set_data : scheme({schema_name}) : len({len(data)})')
        self._storage.set_data(schema_name, data, self._store_cfg.record_chunk_size, self._store_cfg.record_allow_upsert)

    def get_data(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        if not self._storage:
            raise Exception(f'StoreEntity({self._store_cfg.id}) : get_data : Storage is not set')
        data = self._storage.get_data(schema_name, filters, columns)
        self._logger.log_info(f'StoreEntity({self._store_cfg.id}) : get_data : scheme({schema_name}) : len({len(data)})')
        return data

    async def get_data_async(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        if not self._storage:
            raise Exception(f'StoreEntity({self._store_cfg.id}) : get_data : Storage is not set')
        data = await self._storage.get_data_async(schema_name, filters, columns)
        self._logger.log_info(f'StoreEntity({self._store_cfg.id}) : get_data : scheme({schema_name}) : len({len(data)})')
        return data
import json
import pandas as pd
from typing import List, Dict, Any, Optional

from store.storage import Storage, StorageType
from util.db.orm_proc import OrmProc
from util.scheme_define import SchemaDefinition
# from util.log_util import Logger


class OracleStorage(Storage):

    def __init__(self, storage_cfg: dict):
        super().__init__(storage_cfg)
        if self._storage_cfg.get('type', '').upper() != StorageType.ORACLE:
            raise Exception(f'OracleStoreEntity : store type is not Oracle')
        self._ip: str = self._storage_cfg.get('ip', '')
        self._port: int = int(self._storage_cfg.get('port', 0))
        self._user: str = self._storage_cfg.get('user', '')
        self._password: str = self._storage_cfg.get('password', '')
        self._sid: str = self._storage_cfg.get('db', '')
        self._param: dict = json.loads(self._storage_cfg.get('param', '{}').strip())
        self._orm_proc = OrmProc(StorageType.ORACLE, self._user, self._password, self._ip, self._port, self._sid, **self._param)

    def _print(self) -> str:
        return (f'OracleStorage('
                f'ip={self._ip}, port={self._port}, user={self._user}, password={self._password}, '
                f'db={self._sid}, param={json.dumps(self._param)})')

    def apply_schema(self, schema: SchemaDefinition):
        self._orm_proc.create_table(schema)

    def set_data(self, schema_name: str, data: pd.DataFrame, chunk_size: int, enable_upsert: bool):
        self._orm_proc.set_data(schema_name, data, chunk_size, enable_upsert)

    def get_data(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        return self._orm_proc.get_data(schema_name, filters, columns)

    async def get_data_async(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:

        return await self._orm_proc.get_data_async(schema_name, filters, columns)

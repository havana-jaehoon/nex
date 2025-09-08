import pandas as pd
from typing import Optional, Dict, List, Any
from abc import ABC, abstractmethod
from strenum import StrEnum

from format.scheme_parser import SchemaDefinition


class StorageType(StrEnum):
    DISK = 'DISK'
    ORACLE = 'ORACLE'
    MYSQL = 'MYSQL'


class Storage(ABC):

    def __init__(self, storage_cfg: dict):
        self._storage_cfg = storage_cfg

    def __str__(self):
        return self._print()

    @abstractmethod
    def _print(self) -> str:
        pass

    @abstractmethod
    def apply_schema(self, schema: SchemaDefinition) -> bool:
        pass

    @abstractmethod
    def set_data(self, schema_name: str, data: pd.DataFrame, chunk_size: int, enable_upsert: bool):
        pass

    @abstractmethod
    def get_data(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        pass

    @abstractmethod
    async def get_data_async(self, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        pass

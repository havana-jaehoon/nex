from typing import Optional

from store.storage_imp.oracle import OracleStorage
from store.storage import Storage, StorageType


class StorageApi:

    @staticmethod
    def getStorageInfo(storage_config: dict) -> Optional[dict]:
        storage_type_value = storage_config.get('storageType')
        if not storage_type_value:
            return None
        storage_info = storage_config.get(storage_type_value)
        return storage_info

    @staticmethod
    def createStorageInstance(storage_config: dict) -> Optional[Storage]:
        storage_info = StorageApi.getStorageInfo(storage_config)
        if not storage_info:
            return None
        if storage_info.get('dbType', '').upper() == StorageType.ORACLE:
            return OracleStorage(storage_info)
        else:
            return None

    @staticmethod
    def createDbStorageInstance(storage_info: dict) -> Optional[Storage]:
        if storage_info.get('dbType', '').upper() == StorageType.ORACLE:
            return OracleStorage(storage_info)
        else:
            return None
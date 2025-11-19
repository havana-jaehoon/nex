from typing import Optional, Tuple

from store.storage_imp.mysql import MysqlStorage
from store.storage_imp.oracle import OracleStorage
from store.storage import Storage, StorageType


class StorageApi:

    @staticmethod
    def getStorageInfo(storage_config: dict) -> Optional[Tuple[str, dict]]:
        storage_type = storage_config.get('storageType')
        if not storage_type:
            return None
        storage_info = storage_config.get(storage_type)
        return storage_type, storage_info

    @staticmethod
    def createStorageInstance(storage_config: dict) -> Optional[Storage]:
        storage_v = StorageApi.getStorageInfo(storage_config)
        if not storage_v:
            return None
        storage_type, storage_info = storage_v
        if storage_type.upper() == "DB":
            return StorageApi.createDbStorageInstance(storage_info)
        else:
            return None

    @staticmethod
    def createDbStorageInstance(storage_info: dict) -> Optional[Storage]:
        if storage_info.get('dbType', '').upper() == StorageType.ORACLE:
            return OracleStorage(storage_info)
        elif storage_info.get('dbType', '').upper() == StorageType.MYSQL:
            return MysqlStorage(storage_info)
        else:
            return None
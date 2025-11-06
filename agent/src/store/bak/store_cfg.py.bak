from typing import List

from jsonConfig.node_json import NodeType


class StoreConfig:

    class Record:
        def __init__(self, json_data: dict):
            self.type: str = json_data.get("type")
            if not self.type: raise Exception("StoreConfig.Record : type is empty")
            self.unit: str = json_data.get("unit")
            self.block: str = json_data.get("block")
            self.expire: int = int(json_data.get("expire", 0))
            self.expire_unit: str = json_data.get("expireUnit")
            self.allow_duplication: bool = bool(json_data.get("allowDuplication", False))
            self.allow_keepValue: bool = bool(json_data.get("allowKeepValue", False))
            self.allow_upsert: bool = bool(json_data.get("allowUpsert", False))
            self.chunk_size: int = int(json_data.get("chunkSize", 0))

        def __str__(self):
            return (f"record(type={self.type},"
                    f"unit={self.unit},"
                    f"block={self.block},"
                    f"expire={self.expire},"
                    f"expire_unit={self.expire_unit},"
                    f"allow_duplication={self.allow_duplication},"
                    f"allow_keepValue={self.allow_keepValue},"
                    f"allow_upsert={self.allow_upsert},"
                    f"chunk_size={self.chunk_size})")

    def __init__(self, parent_list: List[str], json_data: dict):
        if not json_data:
            raise Exception("StoreConfig : json_data is None")

        json_type = json_data.get("type", '')
        if json_type.upper() != NodeType.STORE.upper():
            raise Exception("StoreConfig : type is not STORE")

        self._name: str = json_data.get("name")
        if not self._name: raise Exception("StoreConfig : name is empty")
        self._storage_name: str = json_data.get("storageName")
        if not self._storage_name: raise Exception("StoreConfig : storageName is empty")
        self._id = f'/{"/".join(parent_list)}/{self._name}'
        self._record = self.Record(json_data.get("record"))


    def __str__(self):
        return (f'id={self._id}, '
                f'name={self._name}, '                
                f'storageName={self._storage_name}, '
                f'{self._record}')

    @property
    def name(self) -> str:
        return self._name

    @property
    def storage_name(self) -> str:
        return self._storage_name

    @property
    def id(self) -> str:
        return self._id

    @property
    def record_type(self) -> str:
        return self._record.type

    @property
    def record_unit(self) -> str:
        return self._record.unit

    @property
    def record_block(self) -> str:
        return self._record.block

    @property
    def record_expire(self) -> int:
        return self._record.expire

    @property
    def record_expire_unit(self) -> str:
        return self._record.expire_unit

    @property
    def record_allow_duplication(self) -> bool:
        return self._record.allow_duplication

    @property
    def record_allow_keepValue(self) -> bool:
        return self._record.allow_keepValue

    @property
    def record_allow_upsert(self) -> bool:
        return self._record.allow_upsert

    @property
    def record_chunk_size(self) -> int:
        return self._record.chunk_size
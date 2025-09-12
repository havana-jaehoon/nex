from typing import List, Optional

import const_def


class ElementConfig:

    def __init__(self, parent_list: List[str], json_data: dict):
        if not json_data:
            raise Exception("ElementConfig : json_data is None")

        json_type = json_data.get("type", '')
        if json_type.upper() != const_def.ELEMENT_TYPE.upper():
            raise Exception("ElementConfig : type is not ELEMENT")

        self._name: str = json_data.get("name")
        if not self._name: raise Exception("ElementConfig : name is empty")
        self._dispName: str = json_data.get("dispName")
        if not self._dispName: self._dispName = self._name
        self._description: str = json_data.get("description")
        if not self._description: self._description = self._name
        self._format: str = json_data.get("format")
        self._store: str = json_data.get("store")
        self._processor: str = json_data.get("processor")
        if not self._processor: raise Exception("ElementConfig : processor is empty")
        self._processingInterval: int = json_data.get("processingInterval", 0)
        self._processingUnit: str = json_data.get("processingUnit")
        self._sources: str = json_data.get("sources")
        self._id = f'/{"/".join(parent_list)}/{self._name}'

    def __str__(self):
        return (f'id={self._id}, '
                f'name={self._name}, '
                f'format={self._format}, '
                f'store={self._store}, '
                f'processor={self._processor}, '
                f'processingInterval={self._processingInterval}, '
                f'processingUnit={self._processingUnit}, '
                f'sources={self._sources}')

    @property
    def name(self) -> str:
        return self._name

    @property
    def dispName(self) -> str:
        return self._dispName

    @property
    def description(self) -> str:
        return self._description

    @property
    def format(self) -> str:
        return self._format

    @property
    def store(self) -> str:
        return self._store

    @property
    def processor(self) -> str:
        return self._processor

    @property
    def processingInterval(self) -> int:
        return self._processingInterval

    @property
    def processingUnit(self) -> Optional[str]:
        return self._processingUnit

    @property
    def sources(self) -> Optional[str]:
        return self._sources

    @property
    def id(self) -> str:
        return self._id

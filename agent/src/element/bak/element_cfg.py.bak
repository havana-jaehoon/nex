from abc import abstractmethod, ABC
from typing import List, Optional

from jsonConfig.node_json import NodeType


class BaseElementConfig(ABC):

    def __init__(self, parent_list: List[str], json_data: dict):
        if not json_data:
            raise Exception("BaseElementConfig : json_data is None")

        self._name: str = json_data.get("name")
        if not self._name: raise Exception("BaseElementConfig : name is empty")
        self._dispName: str = json_data.get("dispName")
        if not self._dispName: self._dispName = self._name
        self._description: str = json_data.get("description")
        if not self._description: self._description = self._name
        self._id: str = self._gen_id(parent_list, json_data)

    @abstractmethod
    def _gen_id(self, parent_list: List[str], json_data: dict) -> str:
        pass

    @property
    def id(self) -> str:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    @property
    def dispName(self) -> str:
        return self._dispName

    @property
    def description(self) -> str:
        return self._description


class ElementConfig(BaseElementConfig):

    def __init__(self, parent_list: List[str], json_data: dict):
        super().__init__(parent_list, json_data)

        json_type = json_data.get("type", '')
        if json_type.upper() != NodeType.ELEMENT.upper():
            raise Exception("ElementConfig : type is not ELEMENT")

        self._format: str = json_data.get("format")
        if not self._format: raise Exception("ElementConfig : format is empty")
        self._store: str = json_data.get("store")
        if not self._store: raise Exception("ElementConfig : store is empty")
        self._processor: Optional[str] = json_data.get("processor")
        self._processingInterval: Optional[int] = json_data.get("processingInterval")
        self._processingUnit: Optional[str] = json_data.get("processingUnit")
        self._sources: List[str] = json_data.get("sources", [])

    def _gen_id(self, parent_list: List[str], json_data: dict) -> str:
        parent_path = f'/{"/".join(parent_list)}' if parent_list else ''
        return f'{parent_path}/{self._name}'

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
    def format(self) -> Optional[str]:
        return self._format

    @property
    def store(self) -> Optional[str]:
        return self._store

    @property
    def processor(self) -> Optional[str]:
        return self._processor

    @property
    def processingInterval(self) -> Optional[int]:
        return self._processingInterval

    @property
    def processingUnit(self) -> Optional[str]:
        return self._processingUnit

    @property
    def sources(self) -> List[str]:
        return self._sources

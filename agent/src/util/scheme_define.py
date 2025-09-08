from typing import Any, Dict, Type, List
from dataclasses import dataclass, replace
from strenum import StrEnum


class MetaKeyword(StrEnum):
    IS_KEY = 'IS_KEY'
    DEFAULT = 'DEFAULT'
    PARAMETER = 'PARAMETER'


@dataclass(frozen=True)
class FieldDefinition:
    name: str
    python_type: Type
    metadata: Dict[str, Any]


@dataclass(frozen=True)
class SchemaDefinition:
    name: str
    fields: List[FieldDefinition]

    def change_name(self, new_name: str) -> 'SchemaDefinition':
        return replace(self, name=new_name)

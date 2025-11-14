from datetime import datetime,  date, time
from typing import Type, List, Tuple

from util.scheme_define import SchemaDefinition, FieldDefinition, MetaKeyword


class SchemaParser:
    EXTERNAL_PATH_PREFIX = '.ext'

    @staticmethod
    def _featureType_to_pyType(feature_type: str) -> Type:
        if feature_type.upper() == "NUMBER":
            return int
        elif feature_type.upper() == "FLOAT":
            return float
        elif feature_type.upper() == "BOOLEAN":
            return bool
        elif feature_type.upper() == "TIMESTAMP":
            return datetime
        else:
            return str

    @staticmethod
    def _pyType_to_featureType(py_type: Type) -> str:
        if py_type is bool:
            return "BOOLEAN"
        if py_type in (int,):
            return "NUMBER"
        if py_type in (float,):
            return "FLOAT"
        if py_type in (datetime, date, time):
            return "TIMESTAMP"
        if py_type is str:
            return "STRING"
        return "STRING"

    @staticmethod
    def _configPath_to_schemaName(element_parent_list: List[str], element_name: str) -> str:
        if element_parent_list and element_parent_list[0] == SchemaParser.EXTERNAL_PATH_PREFIX:
            if len(element_parent_list) > 2:
                return f'{"_".join(element_parent_list[2:])}_{element_name}'.lower()
            else:
                return element_name.lower()
        else:
            return f'{"_".join(element_parent_list)}_{element_name}'.lower()

    @staticmethod
    def _schemaName_to_configPath(schema_name: str) -> Tuple[List[str], str]:
        parent_list = schema_name.split('_')[:-1]
        config_name = schema_name.split('_')[-1]
        return parent_list, config_name

    @staticmethod
    def createSchemeInstance(element_parent_list: List[str], element_name: str, format_json_data: dict) -> SchemaDefinition:
        schema_name = SchemaParser._configPath_to_schemaName(element_parent_list, element_name)

        field_definitions = []
        for feature in format_json_data.get('features', []):
            field_name = feature.get('name')
            feature_type = feature.get('featureType')
            if not field_name or not feature_type:
                raise ValueError("SchemaParser : fail to parse json. feature is invalid")

            python_type = SchemaParser._featureType_to_pyType(feature_type)
            if not python_type:
                raise TypeError(f"SchemaParser : invalid feature_type('{feature_type}')")

            metadata = {
                MetaKeyword.IS_KEY: feature.get('isKey', False),
                MetaKeyword.DEFAULT: feature.get('default', None),
                MetaKeyword.PARAMETER: feature.get('parameter', [])
            }
            field_definitions.append(FieldDefinition(name=field_name, python_type=python_type, metadata=metadata))
        return SchemaDefinition(name=schema_name, fields=field_definitions)

    @staticmethod
    def extractConfigFromSchema(schema_def: SchemaDefinition) -> Tuple[str, dict]:
        fmt = {
            "name": schema_def.name,
            "dispName": schema_def.name,
            "type": "format",
            "features": []
        }
        for f in schema_def.fields:
            is_key = bool(f.metadata.get(MetaKeyword.IS_KEY)) if f.metadata else False
            fmt["features"].append({
                "name": f.name,
                "dispName": f.name,
                "type": "feature",
                "isKey": is_key,
                "featureType": SchemaParser._pyType_to_featureType(f.python_type)
            })
        return schema_def.name, fmt

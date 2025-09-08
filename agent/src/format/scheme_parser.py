import re
from datetime import datetime

from util.scheme_define import SchemaDefinition, FieldDefinition, MetaKeyword


JSON_TYPE_TO_PYTHON_TYPE = {
    "STRING": str,
    "INT": int,
    "FLOAT": float,
    "BOOLEAN": bool,
    "TIMESTAMP": datetime
}


class SchemaParser:

    @staticmethod
    def _create_pascal_case_name(name: str) -> str:
        name = re.sub(r'[-_]', ' ', name)
        return name.title().replace(' ', '')

    @staticmethod
    def parse_json_to_schema(format_json_data: dict) -> SchemaDefinition:
        class_name = SchemaParser._create_pascal_case_name(format_json_data.get('name'))
        if not class_name:
            raise ValueError("SchemaParser : fail to parse json. name is empty.")

        field_definitions = []
        for feature in format_json_data.get('features', []):
            field_name = feature.get('name')
            feature_type = feature.get('featureType')
            if not field_name or not feature_type:
                raise ValueError("SchemaParser : fail to parse json. feature is invalid")

            python_type = JSON_TYPE_TO_PYTHON_TYPE.get(feature_type)
            if not python_type:
                raise TypeError(f"SchemaParser : invalid feature_type('{feature_type}')")

            metadata = {
                MetaKeyword.IS_KEY: feature.get('isKey', False),
                MetaKeyword.DEFAULT: feature.get('default', None),
                MetaKeyword.PARAMETER: feature.get('parameter', [])
            }
            field_definitions.append(FieldDefinition(name=field_name, python_type=python_type, metadata=metadata))
        return SchemaDefinition(name=class_name, fields=field_definitions)

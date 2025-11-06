from typing import Optional

from format.scheme_parser import SchemaParser, SchemaDefinition


class FormatApi:

    @staticmethod
    def createSchemeInstance(format_config: dict, change_scheme_name: str) -> Optional[SchemaDefinition]:
        schem_def = SchemaParser.parse_json_to_schema(format_config)
        return schem_def.change_name(change_scheme_name)

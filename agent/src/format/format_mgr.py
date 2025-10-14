from typing import Dict, List, Optional

from system_info import SystemInfoMgr
from format.scheme_parser import SchemaParser, SchemaDefinition
from jsonConfig.node_json import NodeJson, NodeType
from util.singleton import SingletonInstance
from util.log_util import Logger


class FormatMgr(SingletonInstance):

    def _on_init_once(self):
        self._logger = Logger()
        self._formats: Dict[str, SchemaDefinition] = {}   # key: format_id
        config_info_list = NodeJson.get_type_config(f'{SystemInfoMgr().config_dir}', NodeType.FORMAT)
        for config_info in config_info_list:
            schem_def = SchemaParser.parse_json_to_schema(config_info[1])
            format_id = FormatMgr._gen_format_id(config_info[0], config_info[1].get("name"))
            self._formats[format_id] = schem_def
            self._logger.log_info(f'SchemaDefinition is registered. Format(id={format_id}, scheme_name={schem_def.name})')

    @staticmethod
    def _gen_format_id(parent_list: List[str], format_name: str) -> str:
        return f'/{"/".join(parent_list)}/{format_name}'

    # @staticmethod
    # def _find_format_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
    #     final_result = []
    #
    #     def _traverse(node: dict, current_path: List[str]):
    #         if isinstance(node, dict) and node.get('type', '').upper() == const_def.FORMAT_TYPE:
    #             final_result.append((current_path, node))
    #             return
    #
    #         if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
    #             folder_name = node.get('name')
    #             if not folder_name:
    #                 raise Exception(f'FormatMgr : folder name is empty')
    #             current_path.append(folder_name)
    #             children = node.get('children', [])
    #             if isinstance(children, list):
    #                 for child in children:
    #                     _traverse(child, current_path)
    #
    #     _traverse(json_data, [])
    #     return final_result

    def get_scheme_instance(self, format_id: str, change_scheme_name: str) -> Optional[SchemaDefinition]:
        orig_scheme = self._formats.get(format_id, None)
        if not orig_scheme:
            return None
        return orig_scheme.change_name(change_scheme_name)

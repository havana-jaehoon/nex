import glob, json
from typing import Dict, List, Tuple

import const_def
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from command.cmd_entity import CmdEntity
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class CmdMgr(SingletonInstance):

    def _on_init_once(self, element_mgr: ElementMgr):
        self._logger = Logger()
        self._cmds: Dict[str, CmdEntity] = {}   # key: cmd_id
        for cmd_file in glob.glob(f'{SystemInfoMgr().config_dir}/command/**/*.json', recursive=True):
            with open(cmd_file, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
                Logger().log_info(f'CmdMgr : cmd_file : {cmd_file}, cmd_json : {json_data}')
                cmd_json_list = self._find_cmds_with_top_parent_name(json_data)
                for cmd_json in cmd_json_list:
                    cmd_entity = CmdEntity(cmd_json[0], cmd_json[1], element_mgr)
                    self._cmds[cmd_entity.get_id()] = cmd_entity
                    self._logger.log_info(f'Cmd is registered: {cmd_entity}')

    @staticmethod
    def _find_cmds_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
        final_result = []

        def _traverse(node: dict, current_path: List[str]):
            if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
                folder_name = node.get('name')
                if not folder_name:
                    raise Exception(f'CmdMgr : _find_cmds_with_top_parent_name : folder name is empty')
                current_path.append(folder_name)
                children = node.get('children', [])
                if isinstance(children, list):
                    for child in children:
                        _traverse(child, current_path)
            else:
                final_result.append((current_path, node))
                return

        _traverse(json_data, [])
        return final_result

    def get_query_handlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        return_list = []
        for cmd in self._cmds.values():
            handler, kwargs = cmd.get_query_handler()
            return_list.append((cmd.get_subUrl(), handler, kwargs))
        return return_list

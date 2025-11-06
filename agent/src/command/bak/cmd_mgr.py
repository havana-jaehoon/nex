from typing import Dict, List, Tuple
from apscheduler.schedulers.background  import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from command.bak.cmd_entity import CmdEntity
from jsonConfig.node_json import NodeJson, NodeType
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class CmdMgr(SingletonInstance):

    def _on_init_once(self, element_mgr: ElementMgr):
        self._logger = Logger()
        self._cmds: Dict[str, CmdEntity] = {}   # key: cmd_id
        self._scheduler = BackgroundScheduler(timezone='Asia/Seoul')
        self._scheduler.add_executor(ThreadPoolExecutor(max_workers=20))
        config_info_list = NodeJson.get_type_config(f'{SystemInfoMgr().config_dir}', NodeType.COMMAND)
        for config_info in config_info_list:
            # Logger().log_info(f'CmdMgr : cmd_dir_list : {config_info[0]}, cmd_json : {config_info[1]}')
            cmd_entity = CmdEntity(config_info[0], config_info[1], element_mgr)
            cmd_entity.register_interval(self._scheduler)
            self._cmds[cmd_entity.get_id()] = cmd_entity
            self._logger.log_info(f'Cmd is registered: {cmd_entity}')

    # @staticmethod
    # def _find_cmds_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
    #     final_result = []
    #
    #     def _traverse(node: dict, current_path: List[str]):
    #         if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
    #             folder_name = node.get('name')
    #             if not folder_name:
    #                 raise Exception(f'CmdMgr : _find_cmds_with_top_parent_name : folder name is empty')
    #             current_path.append(folder_name)
    #             children = node.get('children', [])
    #             if isinstance(children, list):
    #                 for child in children:
    #                     _traverse(child, current_path)
    #         else:
    #             final_result.append((current_path, node))
    #             return
    #
    #     _traverse(json_data, [])
    #     return final_result

    def start(self):
        self._scheduler.start()

    def stop(self):
        if self._scheduler.running:
            self._scheduler.shutdown()

    def get_query_handlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        return_list = []
        for cmd in self._cmds.values():
            handler, kwargs = cmd.get_query_handler()
            if handler:
                return_list.append((cmd.get_id(), handler, kwargs))
        return return_list

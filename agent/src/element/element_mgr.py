import pandas as pd
from typing import Dict, List, Tuple
from apscheduler.schedulers.background  import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

from system_info import SystemInfoMgr
from element.element_entity import ElementEntity
from jsonConfig.node_json import NodeJson, NodeType
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class ElementMgr(SingletonInstance):

    def _on_init_once(self):
        self._logger = Logger()
        self._scheduler = BackgroundScheduler(timezone='Asia/Seoul')
        self._scheduler.add_executor(ThreadPoolExecutor(max_workers=20))
        self._elements: Dict[str, ElementEntity] = {}   # key: element_id
        config_info_list = NodeJson.get_type_config(f'{SystemInfoMgr().config_dir}', NodeType.ELEMENT)
        for config_info in config_info_list:
            # Logger().log_info(f'CmdMgr : element_dir_list : {config_info[0]}, cmd_json : {config_info[1]}')
            element_entity = ElementEntity(config_info[0], config_info[1], self)
            element_entity.register_interval(self._scheduler)
            self._elements[element_entity.get_id()] = element_entity
            self._logger.log_info(f'Element is registered: {element_entity}')

    # @staticmethod
    # def _find_elements_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
    #     final_result = []
    #
    #     def _traverse(node: dict, current_path: List[str]):
    #         if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
    #             folder_name = node.get('name')
    #             if not folder_name:
    #                 raise Exception(f'ElementMgr : _find_elements_with_top_parent_name : folder name is empty')
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
        for element in self._elements.values():
            handler, kwargs = element.get_query_handler()
            return_list.append((element.get_id(), handler, kwargs))
        return return_list

    async def get_all_data(self, element_id: str) -> pd.DataFrame:
        element = self._elements.get(element_id, None)
        if element:
            return await element.get_all_data()
        else:
            return pd.DataFrame()

    def set_data(self, element_id: str, data: pd.DataFrame):
        element = self._elements.get(element_id, None)
        if element:
            element.set_data(data)

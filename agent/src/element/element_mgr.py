import glob, json
import pandas as pd
from typing import Dict, List, Tuple
from apscheduler.schedulers.background  import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

import const_def
from system_info import SystemInfoMgr
from element.element_entity import BaseElementEntity, ElementEntity, FuncElementEntity
from util.pi_http.http_handler import Server_Dynamic_Handler
from util.singleton import SingletonInstance
from util.log_util import Logger


class ElementMgr(SingletonInstance):

    def _on_init_once(self):
        self._logger = Logger()
        self._scheduler = BackgroundScheduler(timezone='Asia/Seoul')
        self._scheduler.add_executor(ThreadPoolExecutor(max_workers=20))
        self._elements: Dict[str, BaseElementEntity] = {}   # key: element_id
        for element_file in glob.glob(f'{SystemInfoMgr().config_dir}/element/**/*.json', recursive=True):
            with open(element_file, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
                Logger().log_info(f'ElementMgr : element_file : {element_file}, element_json : {json_data}')
                element_json_list = self._find_elements_with_top_parent_name(json_data)
                for element_json in element_json_list:
                    element_type = BaseElementEntity.get_element_type(element_json[1])
                    if element_type.upper() == const_def.ELEMENT_TYPE.upper():
                        element_entity = ElementEntity(element_json[0], element_json[1], self)
                        element_entity.register_interval(self._scheduler)
                    elif element_type.upper() == const_def.FUNC_ELEMENT_TYPE.upper():
                        element_entity = FuncElementEntity(element_json[0], element_json[1], self)
                    self._elements[element_entity.get_id()] = element_entity
                    self._logger.log_info(f'Element is registered: {element_entity}')

    @staticmethod
    def _find_elements_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
        final_result = []

        def _traverse(node: dict, current_path: List[str]):
            if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
                folder_name = node.get('name')
                if not folder_name:
                    raise Exception(f'ElementMgr : _find_elements_with_top_parent_name : folder name is empty')
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

    def start(self):
        self._scheduler.start()

    def stop(self):
        if self._scheduler.running:
            self._scheduler.shutdown()

    def get_handler_list(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        return_list = []
        for element in self._elements.values():
            handler, kwargs = element.get_req_handler()
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

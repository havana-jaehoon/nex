import glob, json
import pandas as pd
from configparser import ConfigParser
from typing import Dict, List, Tuple, Optional, Any

import const_def
from system_info import SystemInfoMgr
from store.storage_imp.oracle import OracleStorage
from store.store_entity import StoreEntity
from store.storage import Storage, StorageType
from util.scheme_define import SchemaDefinition
from util.singleton import SingletonInstance
from util.log_util import Logger


class StoreMgr(SingletonInstance):

    def _on_init_once(self, storage_cfg_path: str):
        self._logger = Logger()

        # storage
        config = ConfigParser()
        config.read(storage_cfg_path, encoding='utf-8')
        self._storage_dict: Dict[str, Storage] = {}     #key: store_name, value: storage
        for section in config.sections():
            storage = self._create_storage(dict(config.items(section)))
            if storage is None:
                raise Exception(f'StoreMgr : fail to create storage : store_name({section}) is not valid')
            self._storage_dict[section] = storage
            self._logger.log_info(f'Storage is registered. {section}={storage})')

        # store entity
        self._stores: Dict[str, StoreEntity] = {}   # key: store_id
        for store_file in glob.glob(f'{SystemInfoMgr().config_dir}/store/**/*.json', recursive=True):
            with open(store_file, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
                store_json_list = self._find_stores_with_top_parent_name(json_data)
                for store_json in store_json_list:
                    store_entity = StoreEntity(store_json[0], store_json[1])
                    if not store_entity.set_storage(self._storage_dict):
                        raise Exception(f'StoreMgr : fail to set storage : store({store_entity.get_id()}) is not valid')
                    self._stores[store_entity.get_id()] = store_entity
                    self._logger.log_info(f'Store is registered: {store_entity}')

    @staticmethod
    def _create_storage(storage_cfg: dict) -> Storage:
        if storage_cfg.get('type', '').upper() == StorageType.ORACLE:
            return OracleStorage(storage_cfg)
        else:
            raise None

    @staticmethod
    def _find_stores_with_top_parent_name(json_data: dict) -> List[Tuple[List[str], dict]]:
        final_result = []

        def _traverse(node: dict, current_path: List[str]):
            if isinstance(node, dict) and node.get('type', '').upper() == const_def.STORE_TYPE:
                final_result.append((current_path, node))
                return

            if isinstance(node, dict) and node.get('type', '').upper() == const_def.FOLDER_TYPE:
                folder_name = node.get('name')
                if not folder_name:
                    raise Exception(f'StoreMgr : _find_stores_with_top_parent_name : folder name is empty')
                current_path.append(folder_name)
                children = node.get('children', [])
                if isinstance(children, list):
                    for child in children:
                        _traverse(child, current_path)

        _traverse(json_data, [])
        return final_result

    def apply_scheme(self, store_id: str, schema: SchemaDefinition):
        store = self._stores.get(store_id, None)
        if not store:
            raise Exception(f'StoreMgr : apply_scheme : store({store_id}) is not valid')
        else:
            store.apply_schema(schema)

    def set_data(self, store_id: str, schema_name: str, data: pd.DataFrame):
        store = self._stores.get(store_id, None)
        if not store:
            raise Exception(f'StoreMgr : set_data : store({store_id}) is not valid')
        else:
            store.set_data(schema_name, data)

    def get_data(self, store_id: str, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        store = self._stores.get(store_id, None)
        if not store:
            raise Exception(f'StoreMgr : get_data : store({store_id}) is not valid')
        else:
            return store.get_data(schema_name, filters, columns)

    async def get_data_async(self, store_id: str, schema_name: str, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        store = self._stores.get(store_id, None)
        if not store:
            raise Exception(f'StoreMgr : get_data : store({store_id}) is not valid')
        else:
            return await store.get_data_async(schema_name, filters, columns)
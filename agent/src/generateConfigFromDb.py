import argparse
from typing import List

from config.element_cfg import ElementCfg
from format.scheme_parser import SchemaParser
from store.storage_api import StorageApi


def generateConfig(element_parent_list: List[str], element_name: str, format_config: dict, storage_info: dict) -> dict:
    external_path_prefix = f'/{ElementCfg.EXTERNAL_PATH_PREFIX}{storage_info.get("dbType", "")}_{storage_info.get("ip", "")}_{storage_info.get("port", "")}_{storage_info.get("name", "")}'

    format_path = element_path = f'{external_path_prefix}{ElementCfg.genId(element_parent_list, element_name)}'
    storage_path = f'{external_path_prefix}/db/{storage_info.get("name")}'

    storage_config = {
        "name": {storage_info.get("name")},
        "dispName": {storage_info.get("name")},
        "description": {storage_info.get("name")},
        "type": "storage",
        "storageType": "db",
        "db": storage_info
    }

    element_config = {
        "name": element_name,
        "dispName": element_name,
        "description": element_name,
        "type": "element",
        "format": format_path,
        "store": "",
        "storage": storage_path
    }

    return {
        "element_path" : element_path,
        "element": element_config,
        "format_path": format_path,
        "format": format_config,
        "storage_path": storage_path,
        "storage": storage_config
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbType', type=str, default=None, help='dbms type. ex) mysql, postgres, oracle')
    parser.add_argument('--ip', type=str, default=None, help='dbms ip')
    parser.add_argument('--port', type=int, default=None, help='dbms port')
    parser.add_argument('--user', type=str, default=None, help='dbms user')
    parser.add_argument('--password', type=str, default=None, help='dbms password of user')
    parser.add_argument('--name', type=str, default=None, help='db name')
    args = parser.parse_args()
    storage_info = vars(args)
    # storage_info['param'] = {
    #         "pool_size": 10,
    #         "max_overflow": 20,
    #         "pool_timeout": 30,
    #         "pool_recycle": 1800,
    #         "pool_pre_ping": True,
    #         "echo": False
    #     }
    print(f'argument : {storage_info}')

    storage = StorageApi.createDbStorageInstance(storage_info)
    if not storage:
        raise Exception(f"storage is not valid")

    print(f'storage : {storage}')

    for table_name in storage.inspectSchemaNames():
        print(f'table_name : {table_name}')
        scheme = storage.extractSchema(table_name)
        element_parent_list, element_name, format_config = SchemaParser.extractConfigFromSchema(scheme)
        config = generateConfig(element_parent_list, element_name, format_config, storage_info)
        print(f'config : {config}')

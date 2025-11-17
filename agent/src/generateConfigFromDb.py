import json
from typing import List, Dict, Optional

from format.scheme_parser import SchemaParser
from store.storage_api import StorageApi


def _generateElementConfig(element_name: str) -> dict:
    element_config = {
        "name": element_name,
        "dispName": element_name,
        "description": element_name,
        "type": "element",
        "format": "",
        "store": "",
        "storage": ""
    }
    return element_config


def generateConfig(storage_config: dict, schema: Optional[str] = None) -> Optional[Dict[str, List[dict]]]:
    storage_info = StorageApi.getStorageInfo(storage_config)
    if not storage_info:
        return None

    storage = StorageApi.createDbStorageInstance(storage_info)
    if not storage:
        return None

    element_list: List[dict] = []
    format_list: List[dict] = []
    for table_name in storage.inspectSchemaNames(schema):
        scheme = storage.extractSchema(table_name)
        element_name, format_config = SchemaParser.extractConfigFromSchema(scheme)
        element_config = _generateElementConfig(element_name)
        element_list.append(element_config)
        format_list.append(format_config)

    return {
        "element": element_list,
        "format": format_list
    }


if __name__ == "__main__":
    sample_oracle_cbm_config = {
        "name": "cbm_oracle_db",
        "dispName": "CBM DB",
        "description": "CBM DB",
        "type": "storage",
        "storageType": "db",
        "db": {
            "dbType": "oracle",
            "ip": "121.161.164.106",
            "port": 1521,
            "user": "cbm",
            "password": "core0908",
            "name": "ORCLCDB"
        },
        "hdfs": {
            "ip": "",
            "port": 9000,
            "path": ""
        }
    }

    sample_mysql_cbm_config = {
        "name": "cbm_mysql_db",
        "dispName": "CBM DB",
        "description": "CBM DB",
        "type": "storage",
        "storageType": "db",
        "db": {
            "dbType": "mysql",
            "ip": "121.161.164.109",
            "port": 3306,
            "user": "emu",
            "password": "!core0908",
            "name": "emu_web",
            "param": {
                "charset": "latin1"
            }
        },
        "hdfs": {
            "ip": "",
            "port": 9000,
            "path": ""
        }
    }

    # config = generateConfig(sample_oracle_cbm_config, "CBM")
    config = generateConfig(sample_mysql_cbm_config)
    print(json.dumps(config, indent=2, ensure_ascii=False))

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
    storage_v = StorageApi.getStorageInfo(storage_config)
    if not storage_v:
        return None

    storage_name, storage_type, storage_info = storage_v
    if storage_type.upper() != "DB":
        return None

    storage = StorageApi.createDbStorageInstance(storage_info)

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
    sample_cbm_oracle_config = {
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

    sample_cbm_mysql_config = {
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

    sample_vfras_mysql_config = {
        "name": "vfras_mysql_db",
        "dispName": "VFRAS DB",
        "description": "VFRAS DB",
        "type": "storage",
        "storageType": "db",
        "db": {
            "dbType": "mysql",
            "ip": "121.134.202.235",
            "port": 3306,
            "user": "vfras-user",
            "password": "my-user1",
            "name": "VFRAS",
            "param": {
                "charset": "UTF8"
            }
        },
        "hdfs": {
            "ip": "",
            "port": 9000,
            "path": ""
        }
    }

    # config = generateConfig(sample_cbm_oracle_config, "CBM")
    # config = generateConfig(sample_cbm_mysql_config)
    config = generateConfig(sample_vfras_mysql_config)
    print(json.dumps(config, indent=2, ensure_ascii=False))

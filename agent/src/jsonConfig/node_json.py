import os, json
from strenum import StrEnum
from typing import List, Dict, Tuple, Any, Optional

from util.log_util import Logger


NODE_DEFINE_FILE = ".node.json"


class NodeType(StrEnum):
    FOLDER = 'FOLDER'
    ELEMENT = 'ELEMENT'
    COMMAND = 'COMMAND'
    FORMAT = 'FORMAT'
    STORE = 'STORE'


class NodeJson:

    @staticmethod
    def _read_node_file(dir_path: str) -> Optional[Dict[str, Any]]:
        file_path = os.path.join(dir_path, NODE_DEFINE_FILE)
        if not os.path.exists(file_path):
            return None
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None

    @staticmethod
    def _convert_json2file(parent_path: str, node_data: Dict[str, Any]):
        children = node_data.pop("children", None)
        node_name = node_data.get("name")
        if not node_name:
            return

        # make node dir
        current_path = os.path.join(parent_path, node_name)
        os.makedirs(current_path, exist_ok=True)

        # make .node.json file
        node_file_path = os.path.join(current_path, NODE_DEFINE_FILE)
        with open(node_file_path, 'w', encoding='utf-8') as f:
            json.dump(node_data, f, indent=4, ensure_ascii=False)
            Logger().log_info(f"json file write : {node_file_path}")

        # make child nodes
        if children and isinstance(children, list):
            for child_node in children:
                NodeJson._convert_json2file(current_path, child_node)

    @staticmethod
    def _convert_type_file2json(target_type: str, type_path: str, include_children: bool = True) -> List[Dict[str, Any]]:

        def _build(build_type: str, dir_path: str) -> Optional[Dict[str, Any]]:
            node_json = NodeJson._read_node_file(dir_path)
            if node_json is None:
                return None

            node_type = node_json.get("type").upper()
            if node_type != NodeType.FOLDER.upper() and node_type != build_type.upper():
                return None

            if node_type == NodeType.FOLDER.upper() and include_children:
                children = []
                for entry in sorted(os.listdir(dir_path)):
                    child_path = os.path.join(dir_path, entry)
                    if os.path.isdir(child_path):
                        child_node_json = _build(build_type, child_path)
                        children.append(child_node_json)
                if children:
                    node_json["children"] = children
            return node_json

        type_abs_path = os.path.abspath(type_path)
        if not os.path.isdir(type_abs_path):
            raise FileNotFoundError(f"Directory not found: {type_abs_path}")

        type_build_list = []
        for entry in sorted(os.listdir(type_abs_path)):
            node_path = os.path.join(type_abs_path, entry)
            if os.path.isdir(node_path):
                node_build = _build(target_type, node_path)
                if node_build:
                    type_build_list.append(node_build)

        return type_build_list

    @staticmethod
    def convert_all_file2json(file_base_path: str, target_system_name: Optional[str] = None) -> Dict[str, Any]:
        build_top_abs_path = os.path.abspath(file_base_path)
        if not os.path.isdir(build_top_abs_path):
            raise FileNotFoundError(f"Directory not found: {build_top_abs_path}")

        build_data = {}
        for entry in sorted(os.listdir(build_top_abs_path)):
            type_path = os.path.join(file_base_path, entry)
            type_name = os.path.basename(type_path)
            if os.path.isdir(type_path):
                if type_name == 'system':
                    if target_system_name:
                        for system_entry in sorted(os.listdir(type_path)):
                            system_path = os.path.join(type_path, system_entry)
                            system_name = os.path.basename(system_path)
                            if system_name == target_system_name and os.path.isdir(system_path):
                                system_data = NodeJson.convert_all_file2json(system_path)
                                if system_data:
                                    build_data.update(system_data)
                else:
                    type_build = NodeJson._convert_type_file2json(type_name, type_path, include_children=True)
                    if type_build:
                        build_data[type_name] = type_build

        return build_data

    @staticmethod
    def convert_all_json2file(build_data: Dict[str, Any], install_base_path: str) -> bool:
        # make install_base dir
        install_abs_path = os.path.abspath(install_base_path)
        os.makedirs(install_abs_path, exist_ok=True)

        try:
            for type_name, nodes in build_data.items():
                # make type dir
                type_path = os.path.join(install_abs_path, type_name)
                os.makedirs(type_path, exist_ok=True)
                for node_data in nodes:
                    NodeJson._convert_json2file(type_path, node_data)
            return True
        except Exception as e:
            return False

    @staticmethod
    def _get_type_config(
            type_path: str,
            target_type: str,
            parent_folders: List[str],
            results: List[Tuple[List[str], Dict[str, Any]]]
    ):
        def _build(build_current_path: str,
                   build_target_type: str,
                   build_parent_folders: List[str],
                   build_results: List[Tuple[List[str], Dict[str, Any]]]):
            node_json = NodeJson._read_node_file(build_current_path)
            if not node_json:
                return

            node_type = node_json.get("type", "").upper()
            node_name = node_json.get("name")
            if not node_name:
                return

            if node_type == build_target_type.upper():
                build_results.append((build_parent_folders, node_json))
                return

            if node_type == NodeType.FOLDER.upper():
                new_parent_folders = build_parent_folders + [node_name]
                for entry1 in sorted(os.listdir(build_current_path)):
                    child_path = os.path.join(build_current_path, entry1)
                    if os.path.isdir(child_path):
                        _build(child_path, build_target_type, new_parent_folders, build_results)

        for entry in sorted(os.listdir(type_path)):
            node_path = os.path.join(type_path, entry)
            if os.path.isdir(node_path):
                _build(node_path, target_type, parent_folders, results)

    @staticmethod
    def get_type_config(base_path: str, target_type: str) -> List[Tuple[List[str], dict]]:
        results: List[Tuple[List[str], dict]] = []
        base_abs_path = os.path.abspath(base_path)
        if not os.path.isdir(base_abs_path):
            raise FileNotFoundError(f"Directory not found: {base_abs_path}")

        for entry in sorted(os.listdir(base_abs_path)):
            type_path = os.path.join(base_path, entry)
            type_name = os.path.basename(type_path)
            if os.path.isdir(type_path):
                if type_name.upper() == target_type.upper():
                    NodeJson._get_type_config(type_path, target_type, [], results)
                    break

        return results




if __name__ == "__main__":
    tree = NodeJson.convert_all_file2json("/home/cbm/hdkim/ai_solution_cfg_server/config/")
    print(json.dumps(tree, indent=4))

    NodeJson.convert_all_json2file(tree, "/home/cbm/hdkim/ai_solution_cfg_server/temp/")

    result_list = NodeJson.get_type_config("/home/cbm/hdkim/ai_solution_cfg_server/temp/", NodeType.ELEMENT)
    for result in result_list:
        print(result)

    tree = NodeJson.convert_all_file2json("/home/cbm/hdkim/ai_solution_cfg_server/config_data/", 'system1')
    print(json.dumps(tree, indent=4))
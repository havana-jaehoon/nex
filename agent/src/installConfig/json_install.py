import os, json
from typing import List, Dict, Any, Optional

from installConfig import json_def


class JsonInstall:

    @staticmethod
    def _read_node_file(dir_path: str) -> Optional[Dict[str, Any]]:
        file_path = os.path.join(dir_path, json_def.NODE_DEFINE_FILE)
        if not os.path.exists(file_path):
            return None
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None

    @staticmethod
    def _build_type(build_type: str, type_path: str, include_children: bool = True) -> List[Dict[str, Any]]:

        def _build(node_type: str, dir_path: str) -> Optional[Dict[str, Any]]:
            node_json = JsonInstall._read_node_file(dir_path)
            if node_json is None:
                return None

            ntype = node_json.get("type")
            if ntype.upper() != json_def.FOLDER_TYPE.upper() and ntype.upper() != build_type.upper():
                return None

            if ntype.upper() == json_def.FOLDER_TYPE.upper() and include_children:
                children = []
                for entry in sorted(os.listdir(dir_path)):
                    child_path = os.path.join(dir_path, entry)
                    if os.path.isdir(child_path):
                        child_node_json = _build(node_type, child_path)
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
                node_build = _build(build_type, node_path)
                if node_build:
                    type_build_list.append(node_build)

        return type_build_list

    @staticmethod
    def _deassemble_node(parent_path: str, node_data: Dict[str, Any]):
        children = node_data.pop("children", None)
        node_name = node_data.get("name")
        if not node_name:
            return

        # make node dir
        current_path = os.path.join(parent_path, node_name)
        os.makedirs(current_path, exist_ok=True)

        # make .node.json file
        node_file_path = os.path.join(current_path, json_def.NODE_DEFINE_FILE)
        with open(node_file_path, 'w', encoding='utf-8') as f:
            json.dump(node_data, f, indent=4, ensure_ascii=False)

        # make child nodes
        if children and isinstance(children, list):
            for child_node in children:
                JsonInstall._deassemble_node(current_path, child_node)

    @staticmethod
    def build_all(build_top_path: str) -> Dict[str, Any]:
        build_top_abs_path = os.path.abspath(build_top_path)
        if not os.path.isdir(build_top_abs_path):
            raise FileNotFoundError(f"Directory not found: {build_top_abs_path}")

        build_data = {}
        for entry in sorted(os.listdir(build_top_abs_path)):
            type_path = os.path.join(build_top_path, entry)
            type_name = os.path.basename(type_path)
            if os.path.isdir(type_path):
                type_build = JsonInstall._build_type(type_name, type_path, include_children=True)
                if type_build:
                    build_data[type_name] = type_build

        return build_data

    @staticmethod
    def deassemble_all(install_base_path: str, build_data: Dict[str, Any]) -> bool:
        # make install_base dir
        install_abs_path = os.path.abspath(install_base_path)
        os.makedirs(install_abs_path, exist_ok=True)

        try:
            for type_name, nodes in build_data.items():
                # make type dir
                type_path = os.path.join(install_abs_path, type_name)
                os.makedirs(type_path, exist_ok=True)
                for node_data in nodes:
                    JsonInstall._deassemble_node(type_path, node_data)
            return True
        except Exception as e:
            return False




if __name__ == "__main__":
    tree = JsonInstall.build_all("/home/cbm/hdkim/ai_solution_cfg_server/config/")
    print(json.dumps(tree, indent=4))

    JsonInstall.deassemble_all("/home/cbm/hdkim/ai_solution_cfg_server/temp/", tree)
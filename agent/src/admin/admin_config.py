import csv
import json
import os
import logging
import re
import argparse

from admin.admin_init_config import init_nodes, NexNodeType
import shutil

ROOT_PROJECT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../config_admin'))
FILE_NAME = '.node.json'

PROJECT_DIR = os.getcwd()
CONFIG_DIR_NAME = 'config_nex'
#CONFIG_DIR_NAME = os.environ.get('CONFIG_DIR_NAME', 'config_admin')
CONFIG_DIR = os.path.join(PROJECT_DIR, CONFIG_DIR_NAME)

ADMIN_CONFIG_DIR = os.path.join(CONFIG_DIR, 'admin')

NODE_FILE_NAME = '.node.json'
INDEX_FILE_NAME = '.index'

ELEMENT_FILE_NAME = '.element.json'
FORMAT_FILE_NAME = '.format.json'
STORE_FILE_NAME = '.store.json'
PROCESSOR_FILE_NAME = '.processor.json'


def normalize_path(path):
    # Replace backslashes with forward slashes and normalize the path
    if path is None or path == '':
        return "/"
    path = re.sub(r'\\+', '/', path)
    path = re.sub(r'/+', '/', path)
    parts = []
    for part in path.split('/'):
        if part == '..':
            if parts:
                parts.pop()
            else:
                parts.append('..')
        elif part and part != '.':
            parts.append(part)
    return '/' + '/'.join(parts)

# path 는 상대경로 
def get_data(path, data_type):
    try: 
        # read index file
        #mod_path = f"{ADMIN_CONFIG_DIR}/{mod_name}"
        index_file_path = f"{path}/{INDEX_FILE_NAME}"
        if not os.path.exists(index_file_path):
            print(f"Index file does not exist at {index_file_path}")
            return False
        with open(index_file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            index_data = {rows[0]: {'path': rows[1], 'name': rows[2]} for rows in reader}
        
        format_file_path = f"{path}/{FORMAT_FILE_NAME}"

        #print(f"Loaded index data: {index_data}")
        res_datas = []

        if(data_type == 'static') :
            for index, value in index_data.items():
                data_path = f"{path}/{value['path']}"
                data_file_path = f"{path}/{NODE_FILE_NAME}"

                if not os.path.exists(data_file_path):
                    print(f"Node file does not exist at {data_file_path}")
                    return None

                with open(data_file_path, 'r', encoding='utf-8') as f:
                    res_datas.append([index, value['path'], json.load(f)])
                    #print(f"Loaded node data for {value['name']}: {node_data}")

        elif(data_type == 'temporal') : # temporal data YYYY/MM/DD/HH/MM or YYYY/MM/DD/HH or YYYY/MM/DD  
            for time, value in index_data.items(): 
                data_path = f"{path}/{value['path']}"
                data_file_path = f"{data_path}/{FORMAT_FILE_NAME}"

                if not os.path.exists(data_file_path):
                    print(f"Format file does not exist at {data_file_path}")
                    return None

                with open(data_file_path, 'r', encoding='utf-8') as f:
                    res_datas.append([list(csv.reader(f))])

        return res_datas
    
    except Exception as e:
        print(f"Error loading data from path:{path}, error:{e}")
        return None
    


# path 는 상대경로 
def load_admin_config(mod_name, path):
    try: 
        # read index file
        mod_path = f"{ADMIN_CONFIG_DIR}/{mod_name}"
        index_file_path = f"{mod_path}/{INDEX_FILE_NAME}"
        if not os.path.exists(index_file_path):
            print(f"Index file does not exist at {index_file_path}")
            return False
        with open(index_file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            index_data = {rows[0]: {'path': rows[1], 'name': rows[2]} for rows in reader}
        
        #print(f"Loaded index data: {index_data}")
        res_datas = []
        for index, value in index_data.items():
            node_path = f"{mod_path}/{value['path']}"
            node_file_path = f"{node_path}/{NODE_FILE_NAME}"

            if not os.path.exists(node_file_path):
                print(f"Node file does not exist at {node_file_path}")
                return None
            
            with open(node_file_path, 'r', encoding='utf-8') as f:
                node_data = json.load(f)
                #print(f"Loaded node data for {value['name']}: {node_data}")
            
            res_datas.append([index, value['path'], node_data])
        
        return res_datas
    
    except Exception as e:
        print(f"Error loading {mod_name} module configuration: {e}")
        return None
    

def load_all_admin_config():
    try:
        if not os.path.exists(ADMIN_CONFIG_DIR):
            print(f"Root path does not exist at {ADMIN_CONFIG_DIR}")
            return False

        dirs = [f for f in os.listdir(ADMIN_CONFIG_DIR) if os.path.isdir(os.path.join(ADMIN_CONFIG_DIR, f))]

        result_datas = []
        for mod_name in dirs:
            # read index file
            res = load_admin_config(mod_name, "")
            result_datas.append({mod_name: res})
 
        return result_datas
            
    except Exception as e:
        print(f"Error loading all configuration: {e}")
        return False

def make_node_config(root_path, path, nodes, indexing_file, index):
    print(f"make_node_config: root_path={root_path}, path={path}, index={index}")
    try:
        for node in nodes:
            node_name = node['name']
            print(f"Creating node: {node_name} at {path}")
            child_path = f'{path}/{node_name}'
            print(f"# {child_path} -> {path}")
            child_fullpath = f'{root_path}{child_path}'
            print(f"# {root_path}-{child_path}-{child_fullpath}")
            nodeWithoutChildren = {k: v for k, v in node.items() if k != 'children'}
            if not os.path.exists(child_fullpath):
                os.makedirs(child_fullpath, exist_ok=True)

            with open(os.path.join(child_fullpath, NODE_FILE_NAME), 'w', encoding='utf-8') as f:
                json.dump(nodeWithoutChildren, f, ensure_ascii=False, indent=2)

            csv.writer(indexing_file, lineterminator='\n').writerow([index, child_path, node_name])
            index += 1
            if 'children' in node and isinstance(node['children'], list):
                index = make_node_config(root_path, child_path, node['children'], indexing_file, index)
        return index
    
    except Exception as e:
        logging.error(f"make_node_config error: {e}")
        return False

# 초기 설정 파일을 생성하는 함수
def create_config(root_path, file_path):
    print(f"Creating configuration in {root_path} using {file_path}")
    try:
        if not os.path.exists(file_path):
            print(f"project_root.json does not exist at {file_path}")
            return False
        
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for type in data:
            category_root_path = os.path.join(root_path,  type)
            
            if not os.path.exists(category_root_path):
                os.makedirs(category_root_path, exist_ok=True)

            indexing_file = open(os.path.join(category_root_path, INDEX_FILE_NAME), 'w', encoding='utf-8')
            make_node_config(category_root_path, "", data[type], indexing_file, 0)
            indexing_file.close()
            
    except Exception as e:
        print(f"Error reading project_root.json: {e}")
        return False

    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config-dir', type=str, default=None, help='Configuration directory path')
    args = parser.parse_args()
    #print("ROOT_PROJECT:", ROOT_PROJECT)
    #result = get_config("/", True)

    #create_config(os.path.join(ROOT_PROJECT, "admin"), os.path.join(ROOT_PROJECT, "project_root.json"))
    #cfg = load_all_admin_config()
    cfg = load_admin_config("applet", "")
    print("cfg:", json.dumps(cfg, ensure_ascii=False, indent=2))

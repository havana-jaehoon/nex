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

def read_dir(path, includeChildren=False):
    name = os.path.basename(path)
    file_path = os.path.join(path, FILE_NAME)
    #print ("# file_path:", file_path, "child:", includeChildren)
    try:
        if not os.path.exists(file_path):
            node = {'name': name, 'type': 'folder', 'dispName':name, 'children': []}
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                node = json.load(f)
                node = {'name': name, **node}
        if includeChildren and 'children' in node:
            dirs = [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]
            node['children'] = []
            for dir_name in dirs:
                child_path = os.path.join(path, dir_name)
                child_node = read_dir(child_path, includeChildren)
                if(child_node == None):  
                    return None
                node['children'].append(child_node)
        print("# 1. node:", json.dumps(node, ensure_ascii=False, indent=4))
        return node 
    #{ "data": {"node":node, "path":related_path}, "status": "success", "message": "loaded successfully." }
    except Exception as e:
        return None 
        #{ "data": None, "status": "error", "message": str(e) }
    return None
        #{ "data" : None, "status": "error", "message": "failed loading." }


# 해당 path config 를 로드하는 함수
def get_config(path, includeChildren=True):
    #path = path.strip()
    path = normalize_path(path)
    if path == None or path == "/" or path == "":
        dir_path = ROOT_PROJECT
    else:
        dir_path = os.path.normpath(os.path.join(ROOT_PROJECT, path.lstrip('/')))

    print("# 1. dir_path:", dir_path)
    node = read_dir(dir_path, includeChildren)
    if node == None:
        return {"node": None, "path": None, "status": "error", "message": "Failed to load configuration."}
    return {"node": node, "path": path, "status": "success", "message": "Configuration loaded successfully."}


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



# includeChildren 이 False 해당 노드만 추가하고, True 인 경우 해당 노드의 children 도 추가  
def add_config(path, node_type):
    path = normalize_path(path)

    is_new_project = False
    if path == None or path == "/" or path == "":
        # New Project 
        dir_path = ROOT_PROJECT
        is_new_project = True
    else:
        dir_path = os.path.normpath(os.path.join(ROOT_PROJECT, path.lstrip('/')))

    try:       
        node = read_dir(dir_path, False)
        if node == None:
            return {"node": None, "path": None, "status": "error", "message": "Invalid Path."}
        
        if 'children' not in node:
            dir_path = os.path.dirname(dir_path)

        try_count = 10
        new_node = init_nodes[node_type].copy()
        is_new_node = False
        for count in range(0, try_count-1):
            if count == 0:
                new_name = new_node['name']
            else:
                new_name = new_node['name'] + '-' + str(count)
            new_path = os.path.join(dir_path, new_name)
            if not os.path.exists(new_path):
                new_node['name'] = new_name
                is_new_node = True
                break
        
        if is_new_node == False:
            return {"node": None, "path": None, "status": "error", "message": "Failed to add New Node."}

        new_path = os.path.join(dir_path, new_node['name'])
        new_file_path = os.path.join(new_path, FILE_NAME)

        if is_new_project:
            # 새로운 프로젝트인 경우, common 디렉토리를  새로 추가될 new_path 복사
            common_path = os.path.join(ROOT_PROJECT, 'common')
            if os.name == 'nt':
                os.system(f'xcopy /E /I "{common_path}" "{new_path}"')
            else:
                os.system(f'cp -r "{common_path}" "{new_path}"')
            result = update_config(new_path, new_node)
            #print(f'add_config > update_config result: {result}')
            if result['status'] == 'error':
                #remove new_path
                os.rmdir(new_path)            
                return {"node": None, "path": None, "status": "error", "message": "Failed to add New Project."}
            
            node = read_dir(new_path, True)
            if node == None:
                return {"node": None, "path": None, "status": "error", "message": "Failed to add New Project."}
            
            related_path = normalize_path(os.path.relpath(new_path, ROOT_PROJECT))
            return {"node": node, "path": related_path, "status": "success", "message": "New Project added successfully."}
 
        else:
            os.makedirs(new_path, exist_ok=True)
            
            # name 제거 
            new_node = {k: v for k, v in new_node.items() if k != 'name'}
            with open(new_file_path, 'w', encoding='utf-8') as f:
                # children 내 항목 제거
                if 'children' in new_node:
                    new_node['children'] = []
                json.dump(new_node, f, ensure_ascii=False, indent=4)
            

            node = read_dir(new_path, False)
            print("# 1. new_path:", new_path)
            if node == None:
                return {"node": None, "path": None, "status": "error", "message": "Failed to add New Node."}    

            related_path = normalize_path(os.path.relpath(new_path, ROOT_PROJECT))
            return {"node": node, "path": related_path, "status": "success", "message": "New Node added successfully."}

    except Exception as e:
        return {"node": None, "path": None, "status": "error", "message": str(e)}
    


# update node config  에서 path  수행할 경우 node 의 이름이 변경될 경우 업데이트 
# update 시 new node 는 children 을 제외한 나머지 값들을 업데이트 하고, 이름이 변경되었을 경우 해당 디렉토리 이름을 변경
def update_config(path, node):
    path = normalize_path(path)
    # Rename directory if the name has changed
    #print("update_config path:", path)
    #print("update_config node:", json.dumps(node, ensure_ascii=False, indent=4))

    if path == None or path == "/" or path == "":
        old_path = ROOT_PROJECT
    else:
        old_path = os.path.normpath(os.path.join(ROOT_PROJECT, path.lstrip('/')))

    if not os.path.exists(old_path):
        return { "node": None, "path": None,  "status": "error", "message": "Path does not exist."}
    
   
    old_name = os.path.basename(old_path)
    new_name = node['name']
    new_path = os.path.join(os.path.dirname(old_path), new_name)
    new_file_path = os.path.join(new_path, FILE_NAME)
    try:
        if old_name != new_name:
            os.rename(old_path, new_path)

        # Update node properties (excluding 'name') in node.json
        new_node = {k: v for k, v in node.items() if k != 'name'}
        with open(new_file_path, 'w', encoding='utf-8') as file:
            # Remove items in 'children'
            if 'children' in new_node:
                new_node['children'] = []
            json.dump(new_node, file, ensure_ascii=False, indent=4)

        
        # 저장후 다시 읽어서 리턴
        node = read_dir(new_path, False)
        if(node == None):
            return {"node": None, "path": None, "status": "error", "message": "Critical Error."}

        related_path = normalize_path(os.path.relpath(new_path, ROOT_PROJECT))
        return {"node": node, "path": related_path, "status": "success", "message": "Configuration updated successfully."}

    except Exception as e:
        return {"node": None, "path": None,  "status": "error", "message": str(e)}


def delete_config(path):
    path = normalize_path(path)
   # Rename directory if the name has changed
    if path == None or path == "/" or path == "":
        return {"node": None, "path": None, "status": "error", "message": "Root directory cannot be deleted."}
    else:
        dir_path = os.path.normpath(os.path.join(ROOT_PROJECT, path.lstrip('/')))

    print("# 1. dir_path:", dir_path)
    try:
        # Delete Directory
        if os.path.exists(dir_path):
            print("# 2. dir_path:", dir_path)
            parent_path = os.path.dirname(dir_path)
            print("# 2-1. dir_path:", dir_path)
            dirs = [f for f in os.listdir(parent_path) if os.path.isdir(os.path.join(parent_path, f))]
            print("# 2-2. dirs:", dirs)
            dir_name = os.path.basename(dir_path)

            print("# 2-3. dir_path:", dir_path)

            index = dirs.index(dir_name)   

            print("# 3. dir_path:", dir_path)
            shutil.rmtree(dir_path)
            print("# 4. dir_path:", dir_path)

            dirs.remove(dir_name)
            
            if len(dirs) == 0:
                new_path = parent_path
            else:
                if index < len(dirs):
                    new_path = os.path.join(parent_path, dirs[index])
                else:
                    new_path = os.path.join(parent_path, dirs[index - 1])

            print("# 5. related_path:", new_path)
            node = read_dir(new_path, False)
            if(node == None):
                return {"node": None, "path": None, "status": "error", "message": "Critical Error."}

            related_path = normalize_path(os.path.relpath(new_path, ROOT_PROJECT))
            #related_path = normalize_path(related_path)
            print("# 6. related_path:", related_path)
            return {"node":node, "path":related_path, "status": "success", "message": "Configuration deleted successfully."}
            
        else:
            return {"node": None, "path": None, "status": "error", "message": "Path does not exist."}
    except Exception as e:
        return {"node": None, "path": None, "status": "error", "message": str(e)}



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

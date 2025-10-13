import json
import pandas as pd

from command.data_io import DataFileIo

CONFIG_LIST = {
    'FORMAT':'format',
    'STORE':'store',
    'PROCESSOR':'processor',
    'SYSTEM':'system',
    'ELEMENT':'element',
    'CONTENTS':'contents',
    'APPLET':'applet',
    'THEME':'theme',
    'USER':'user',
    'SECTION':'section'
}

# Configuration을 읽기 위한 클래스
class ConfigReader:
    def __init__(self, path:str, ):
        self._path = path  # admin root path

        self._configs = {v: None for v in CONFIG_LIST.values()}
        self._configsTree = {v: None for v in CONFIG_LIST.values()}


        self._load_config()

    def __str__(self):
        return f'ConfigManager({self._path})'
    
    def _make_tree(self, data):
        nodes = {}
        tree = []

        # Sort by path length to ensure parents are processed before children.
        sorted_data = sorted(data, key=lambda x: len(x[1].split('/')))

        for item in sorted_data:
            path = item[1]
            node_data = item[2]

            # Initialize children list for the current node
            if 'children' not in node_data:
                node_data['children'] = []
            
            nodes[path] = node_data

            # Find parent and add current node to parent's children
            parent_path = '/'.join(path.strip('/').split('/')[:-1])
            if parent_path:
                parent_path = '/' + parent_path
            
            parent_node = nodes.get(parent_path)

            if parent_node:
                if 'children' not in parent_node:
                    parent_node['children'] = []
                parent_node['children'].append(node_data)
            else:
                # If no parent found, it's a root node
                tree.append(node_data)
        
        # Clean up empty children lists
        def cleanup_children(node):
            if 'children' in node:
                if not node['children']:
                    del node['children']
                else:
                    for child in node['children']:
                        cleanup_children(child)

        for root_node in tree:
            cleanup_children(root_node)
            
        return tree
    

    def _load_config(self):
        for key, value in CONFIG_LIST.items():
            cfg = DataFileIo(self._path, f'/{value}')
            config_data = cfg.get()
            self._configs[value] = config_data
            self._configsTree[value] = self._make_tree(config_data)
            #print(f"Loaded config for {value}: {json.dumps(self._configsTree[value], ensure_ascii=False, indent=2)}")


    # 전체 데이터 가져오기
    def get(self, type:str):
        return self._configsTree[type]
    
    def getDatas(self, type:str):
        return self._configs[type]


    def getSystem(self, system_name:str):
        system_cfg = self._configs['system']
        if not system_cfg:
            return None
        
        for item in system_cfg:
            if item[2].get('name') == system_name:
                return item[2]
        return None
    
    def getSystems(self)->list[dict]:
        return self._configs['system']
    
    def getElements(self, system_name:str)->list[dict]:

        element_list = []
        system = self.getSystem(system_name)
        if system is None:
            return element_list

        element_cfg = self._configs['element']
        for item in element_cfg:
            if item[2].get('type') == 'element':
                path = item[1]  # path of the element
                element = item[2] # node of the element

                formatPath=element.get('format') # element format path
                storePath=element.get('store') # element store path
                processorPath=element.get('processor') # element processor path

                format = self.getNode('format', formatPath) # element format node config(json object)
                store = self.getNode('store', storePath) # element store node config(json object)
                processor = self.getNode('processor', processorPath) # element processor node config(json object)

                element_list.append({'path': path, 'system': system, 'element': element, 'format': format, 'store': store, 'processor': processor})
        return element_list

    # 특정 노드 데이터 가져오기
    def getNode(self, type:str, path:str):

        config_data = self._configs[type]
        if not config_data:
            return None
        
        for item in config_data:
            if item[1] == path:
                return item[2]
        return None

    # 특정 노드의 자식 노드들 가져오기
    def getChildren(self, type:str, path:str):
        config_data = self._configsTree[type]
        if not config_data:
            return None

        path_list = path.strip('/').split('/')
        print(f'path_list: {path_list.__len__()}, {path_list}')

        if path_list.__len__() == 1 and path_list[0] == '':
            return config_data
        
        for p in path_list:
            found = False
            for node in config_data:
                if node.get('name') == p:
                    config_data = node.get('children', [])
                    found = True
                    break
            if not found:
                return None
        if found:
            return config_data
        return None


if __name__ == '__main__':
    cfg = ConfigReader("./config_nex/.element/admin")

    # 시스템 이름이 'webserver' 인 element 목록 가져오기
    element_list = cfg.getElements('webserver')
    count = 1
    for item in element_list:
        #print(f"{count} element: {json.dumps(item, ensure_ascii=False, indent=2)}")
        path = item.get('path') # element path 
        
        system = item.get('system') # system node config(json object)
        element = item.get('element') # element node config(json object)
        format = item.get('format') # element format node config(json object)
        store = item.get('store') # element store node config(json object)
        processor = item.get('processor') # element processor node config(json object)

        #print(f"# {path} element:", json.dumps(item, ensure_ascii=False, indent=2))
        dataio = DataFileIo("./config_nex/.element", path, system, element, format, store, processor)
        #data = dataio.get()
        #dataio.put(dataset)
        #print(f"# {path} data:", json.dumps(data, ensure_ascii=False, indent=2))
        dataio.upgrade()
        count += 1
        
        #if count > 3:
        #    break
import json
import sys
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

        #self._configs = {v: None for v in CONFIG_LIST.values()}
        #self._configsTree = {v: None for v in CONFIG_LIST.values()}

        self._configMap = {v: None for v in CONFIG_LIST.values()}
        self._configTree = {v: None for v in CONFIG_LIST.values()}

        self._load_config(path)

    def __str__(self):
        return f'ConfigManager({self._path})'

    def _make_config_map(self, datas):
        config_map = {}

        for data in datas:
            index = data[0]
            path = data[1]
            project_name = data[2]
            system_name = data[3]
            node = data[4]

            print(f"# index={index}, path={path}, project={project_name}, system={system_name}")

            if project_name is None or project_name == '':
                project_name = '*'
                #all_projects.append(data)

            if system_name is None or system_name == '':
                system_name = '*'
                #all_systems.append(data)
                
            if project_name not in config_map:
                config_map[project_name] = {}
            if system_name not in config_map[project_name]:
                config_map[project_name][system_name] = {}
            config_map[project_name][system_name][path] = [index, path, project_name, system_name, node]
        return config_map
   
    def _make_tree(self, config_map):
        nodes = {}
        tree = []

        project_map = {  }

        projects = list(config_map.keys())
        for project in projects:
            systems = list(config_map[project].keys())
            project_map[project] = {}
            #system_map = { }
            for system in systems:
                project_map[project][system] = {}
                system_map = project_map[project][system]

                datas = [config_map[project][system][path] for path in config_map[project][system]]

                #print(f"Processing item: {datas}")

                # Sort by path length to ensure parents are processed before children.
                sorted_data = sorted(datas, key=lambda x: len(x[1].split('/')))

                for item in sorted_data:
                    #print(f"Processing item: {item}")
                    index = item[0]
                    path = item[1]
                    project_name = item[2]
                    system_name = item[3]
                    node_data = item[4]

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
            
                project_map[project][system] = tree
                #return tree

        return project_map


    def _make_elements(self, config_map):
        elements = {}


        elementMap = config_map['element']
        
        systemMap = config_map['system']
        formatMap = config_map['format']
        storeMap = config_map['store']
        processorMap = config_map['processor']

        projects = list(elementMap.keys())
        for project in projects:
            systems = list(elementMap[project].keys())
            elements[project] = {}
            #system_map = { }
            for system in systems:
                if(system == '*'):
                    continue

                print(f"Making elements for project={project}, system={system}")
                elements[project][system] = []

                for path, item in elementMap[project][system].items():
                    if(path != item[1]) :  # path of the element
                        continue
                    # index = item[0] # index of the element
                    # path = item[1] # path of the element
                    # project = item[2] # project of the element
                    # system = item[3] # system of the element
                    # node = item[4] # node of the element
                    elementNode = item[4] # node of the element

                    if elementNode.get('type') != 'element':
                        continue

                    formatPath=elementNode.get('format') # element format path
                    storePath=elementNode.get('store') # element store path
                    processorPath=elementNode.get('processor') # element processor path

                    formatRow = formatMap[project]['*'].get(formatPath, None) 
                    formatNode = formatRow[4] if formatRow else None

                    storeRow = storeMap[project]['*'].get(storePath, None)
                    storeNode = storeRow[4] if storeRow else None

                    processorRow = processorMap[project]['*'].get(processorPath, None)
                    processorNode = processorRow[4] if processorRow else None

                    systemRow = systemMap[project]['*'].get(f'/{system}', None)
                    systemNode = systemRow[4] if systemRow else None

                    if systemNode is None:
                        print(f"System node not found for project={project}, system={system}, path=/{system}")
                        continue
                    elements[project][system].append({'path':path, 'system':systemNode, 'element':elementNode, 'format':formatNode, 'store':storeNode, 'processor':processorNode })

        #print(f"Made elements: {json.dumps(elements, ensure_ascii=False, indent=2)}")
        return elements



    def _load_config(self, path):
        for key, value in CONFIG_LIST.items():
            cfg = DataFileIo(path, f'/{value}')
            config_data = cfg.get()
            #print(f"Loaded config for {value}: {json.dumps(config_data, ensure_ascii=False, indent=2)}")
            #self._configs[value] = config_data

            #print(f"Loading config for {value}: {json.dumps(config_data, ensure_ascii=False, indent=2)}")
            self._configMap[value] = self._make_config_map(config_data)
            self._configTree[value] = self._make_tree(self._configMap[value])
        
        self._elements = self._make_elements(self._configMap)
            #self._configsTree[value] = self._make_tree(self._configMap)
            #print(f"Loaded config for {value}: {json.dumps(self._configsTree[value], ensure_ascii=False, indent=2)}")


    # 전체 데이터 가져오기
    def get(self, type:str, project:str=None, system:str=None):
        if project is None or project=="":
            project_name = '*'
        if system is None or system=="":
            system_name = '*'

        return self._configTree[type][project_name][system_name]
    
    def getDatas(self, type:str, project:str=None, system:str=None):
        if project is None or project=="":
            project_name = '*'
        if system is None or system=="":
            system_name = '*'
        return self._configs[type][project_name][system_name]


    def getSystem(self, project:str, system:str):
        #system_cfg = self._configs['system']
        if project is None or project=="":
            project = '*'

        systemRow = self._configMap['system'].get(project, {}).get(f'{system}', {}).get(f'/{system}', None)
        if systemRow is None:
            systemRow = self._configMap['system'].get(project, {}).get('*', {}).get(f'/{system}', None)

        print(f"Getting system for project={project}, system={system}, sys={self._configMap['system'].get(project, {})}")


        if systemRow is None:
            return None
        return systemRow[4]
    

    def getElements(self, project:str, system:str)->list[dict]:
        project_name = project if project and project != "" else '*'
        system_name = system if system and system != "" else '*'

        return self._elements.get(project_name, {}).get(system_name, [])
        
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
    element_list = cfg.getElements('', 'webserver')
    #count = 1
    #print(f"Total elements: {element_list}")
    for item in element_list:
        #print(f"{count} element: {json.dumps(item, ensure_ascii=False, indent=2)}")
        path = item.get('path') # element path 
        
        system = item.get('system') # system node config(json object)
        element = item.get('element') # element node config(json object)
        format = item.get('format') # element format node config(json object)
        store = item.get('store') # element store node config(json object)
        processor = item.get('processor') # element processor node config(json object)

        print(f"# {path} element:", json.dumps(item, ensure_ascii=False, indent=2))
        dataio = DataFileIo("./config_nex/.element", path, system, element, format, store, processor)
        #data = dataio.get()
        #dataio.put(dataset)
        #print(f"# {path} data:", json.dumps(data, ensure_ascii=False, indent=2))
        #dataio.upgrade()
        #count += 1
        
        #if count > 3:
        #    break
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
        self._configList = {v: [] for v in CONFIG_LIST.values()}
        self._configMap = {v: None for v in CONFIG_LIST.values()}
        self._configTreeMap = {v: None for v in CONFIG_LIST.values()}

        self._load_config(path)

    def __str__(self):
        return f'ConfigManager({self._path})'

    def _make_config_map(self, datas):
        config_map = {}
        config_list = []
        for data in datas:
            index = data[0]
            path = data[1]
            project_name = data[2]
            system_name = data[3]

            obj = data[4]


            ###########
            # 다른곳으로 이동 필요
            keys = list(data[4].keys())
            values = list(data[4].values())

            node = {}
            if len(keys) == 1 and keys[0].isdigit():
                # 새로운 설정포맷이 적용된 데이터
                node = values[0]
                #print(f"# Warning: index key found in data[4], skipping data: {data}")
            else :
                # 기존 설정포맷이 적용된 데이터
                node = data[4] 
            ###########
                
            if project_name not in config_map:
                config_map[project_name] = {}
            if system_name not in config_map[project_name]:
                config_map[project_name][system_name] = []

            
            config_map[project_name][system_name].append([index, path, project_name, system_name, obj])
            config_list.append([index, path, project_name, system_name, obj])
        return config_map, config_list
   
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

                configList = config_map[project][system]

                # datas는 [index, path, project_name, system_name, node_data] 형식의 리스트입니다.
                # 경로(path)를 기준으로 정렬하여 부모 노드가 자식 노드보다 먼저 처리되도록 합니다.
                # 먼저 경로의 깊이(세그먼트 수)로 정렬하고, 깊이가 같으면 경로 문자열로 정렬합니다.
                sorted_data = sorted(configList, key=lambda x: (len(x[1].strip('/').split('/')), x[1]))

                for item in sorted_data:
                    #print(f"Processing item: {item}")
                    index = item[0]
                    path = item[1]
                    project_name = item[2]
                    system_name = item[3]
                    node_data = item[4]

                    #print(f"Index: {index}, Path: {path}, Project: {project_name}, System: {system_name}, Node: {node_data}")
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


    def _getNodeFromObject(self, obj) : 
        if obj is None:
            return obj
        keys = list(obj.keys())
        values = list(obj.values())

        node = {}
        if len(keys) == 1 and keys[0].isdigit():
            # 새로운 설정포맷이 적용된 데이터
            node = values[0]
            #print(f"# Warning: index key found in data[4], skipping data: {data}")
        else :
            # 기존 설정포맷이 적용된 데이터
            node = obj 
        return node

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
                if(system == ''):
                    continue

                #print(f"Making elements for project={project}, system={system}")
                elements[project][system] = []
                systemNode = self.getSystem(project, system)
                if systemNode is None:
                    print(f"System node not found for project={project}, system={system}, path=/{system}")
                    continue

                elementList = elementMap.get(project, {}).get(system, [])
                for item in elementList:

                    index = item[0] # index of the element
                    path = item[1] # path of the element
                    #project = item[2] # project of the element
                    #system = item[3] # system of the element
                    elementNode = self._getNodeFromObject(item[4]) # node of the element
                    #print(f"  Element node: {json.dumps(elementNode, ensure_ascii=False, indent=2)}")
                    if elementNode.get('type') != 'element':
                        continue

                    formatPath=elementNode.get('format') # element format path
                    storePath=elementNode.get('store') # element store path
                    processorPath=elementNode.get('processor') # element processor path

                    formatNode = self.getNode('format', project, '', formatPath)
                    storeNode = self.getNode('store', project, '', storePath)
                    processorNode = self.getNode('processor', project, '', processorPath)
                    
                    #print(f"  Element: path={path}, format={formatNode}, store={storeNode}, processor={processorNode}")

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
            self._configMap[value], self._configList[value] = self._make_config_map(config_data)
            self._configTreeMap[value] = self._make_tree(self._configMap[value])
        
        self._elements = self._make_elements(self._configMap)
            #self._configsTree[value] = self._make_tree(self._configMap)
            #print(f"Loaded config for {value}: {json.dumps(self._configsTree[value], ensure_ascii=False, indent=2)}")


    def get(self) :
        
        return self._configList


    # 전체 데이터 가져오기
    def getTree(self, type:str, project_name:str, system_name:str):
        return self._configTreeMap[type].get(project_name, {}).get(system_name, {})

    def getDatas(self, type:str, project_name:str, system_name:str):
        #print(f"ConfigReader::getDatas({type}, {project_name}, {self._configMap[type].get(project_name, {})})")
        return self._configMap[type].get(project_name, {}).get(system_name, [])

    def getSystem(self, project_name:str, system_name:str):
        systems = self._configMap['system'].get(project_name, {}).get(f'{system_name}', None)

        if systems is None:
            systems = self._configMap['system'].get(project_name, {}).get('', [])

        for item in systems :
            if(item[1] == f'/{system_name}' or item[4].get('name') == system_name):
                return self._getNodeFromObject(item[4])
        return None


    def getSystems(self, project_name:str)->list[dict]:
        systemList = list(self._configMap['system'].get(project_name, {}).values())
        systemNodes = []
        for system in systemList[0] if len(systemList) > 0 else []:
            #print(f"System: {json.dumps(system, ensure_ascii=False, indent=2)}")
            systemNodes.append(self._getNodeFromObject(system[4]))
        return systemNodes

    def getElements(self, project_name:str, system_name:str)->list[dict]:
        return self._elements.get(project_name, {}).get(system_name, [])
        
    # 특정 노드 데이터 가져오기
    def getNode(self, type:str, project_name:str, system_name:str, path:str):
        datas = self._configMap[type].get(project_name, {}).get(system_name, [])

        for data in datas:
            if data[1] == path:
                return self._getNodeFromObject(data[4])
        return None



if __name__ == '__main__':
    cfg = ConfigReader("./config_nex/.element/admin")

    project_name = '' # default project

    systems = cfg.getSystems(project_name)
    #print(f"# systems: {json.dumps(systems, ensure_ascii=False, indent=2)}")
    #print(f"# Format: {json.dumps(format, ensure_ascii=False, indent=2)}")
    

    for system in systems:
        # 시스템 이름이 'webserver' 인 element 목록 가져오기
        system_name = system.get('name', None)
        if system_name is None:
            print(f"# Warning: system name is None, skipping system: {json.dumps(system, ensure_ascii=False, indent=2)}")
            continue
        element_list = cfg.getElements(project_name, system_name)
        #count = 1
        #print(f"Total elements: {element_list}")
        if(element_list is None or len(element_list) == 0):
            print(f"# Warning: No elements found for system '{system_name}'")
            continue

        for item in element_list:
            #print(f"{count} element: {json.dumps(item, ensure_ascii=False, indent=2)}")
            path = item.get('path') # element path 
            
            system = item.get('system') # system node config(json object)
            element = item.get('element') # element node config(json object)
            format = item.get('format') # element format node config(json object)
            store = item.get('store') # element store node config(json object)
            processor = item.get('processor') # element processor node config(json object)
            
            print(f"# {path} item:", json.dumps(format, ensure_ascii=False, indent=2))
            dataio = DataFileIo("./config_nex/.element", path, system, element, format, store, processor)
            #data = dataio.get()
            #dataio.put(dataset)
            
            #print(f"# {element} data:", json.dumps(data, ensure_ascii=False, indent=2))
            dataio.upgrade()
            #count += 1
            
            #if count > 3:
            #    break
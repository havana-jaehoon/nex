import os, json, threading, copy, shutil
from pathlib import Path
from typing import List, Tuple, Dict, Generator, Optional

import url_def
from command.data_io import ELEMENT_CFG_LIST
from util.log_util import Logger


class ElementCfg:

    def __init__(self, element_base_config_dir: str, parent_list: List[str], element_name: str, **kwargs):
        self._apiLock = threading.Lock()
        self._name = element_name
        self._parentList = parent_list
        parent_dir = f'/{"/".join(parent_list)}' if parent_list else ''
        self._elementConfigDir = f'{element_base_config_dir}{parent_dir}/{self._name}'
        self._id = self.genId(parent_list, element_name)
        self._url = f'{url_def.DATA_URL_PREFIX}{self._id}'
        self._configMap: Dict[str, dict] = {}    # key: config_type(format, element, ...), value: json config

        self._applyConfigMap(**kwargs)

    def __str__(self):
        with self._apiLock:
            return f'\nid={self._id}\nname={self._name}\nconfig=\n{json.dumps(self._configMap, indent=4, ensure_ascii=False)}'

    def _applyConfigMap(self, **kwargs):
        self._configMap = {}
        for k, v in kwargs.items():
            if k in ELEMENT_CFG_LIST.values():
                self._configMap[k.lower()] = v

    @staticmethod
    def genId(parent_list: List[str], element_name: str) -> str:
        parent_dir = f'/{"/".join(parent_list)}' if parent_list else ''
        return f'{parent_dir}/{element_name}'

    @property
    def parentList(self) -> List[str]:
        return self._parentList

    @property
    def name(self) -> str:
        return self._name

    @property
    def id(self) -> str:
        return self._id

    @property
    def url(self) -> str:
        return self._url

    def clone(self):
        clone_obj = ElementCfg.__new__(ElementCfg)
        with self._apiLock:
            clone_obj._apiLock = threading.Lock()
            clone_obj._name = self._name
            clone_obj._parentList = copy.deepcopy(self._parentList)
            clone_obj._elementConfigDir = self._elementConfigDir
            clone_obj._id = self._id
            clone_obj._url = self._url
            clone_obj._configMap = copy.deepcopy(self._configMap)
        return clone_obj

    def writeFile(self):
        if not os.path.exists(self._elementConfigDir):
            os.makedirs(self._elementConfigDir, exist_ok=True)

        with self._apiLock:
            for k, v in self._configMap.items():
                with open(f'{self._elementConfigDir}/.{k}.json', 'w', encoding='utf-8') as f:
                    json.dump(v, f, indent=4, ensure_ascii=False)
                    Logger().log_info(f'Element Config File ({self._name}:{k}) write')

    def removeFile(self):
        if os.path.exists(self._elementConfigDir):
            shutil.rmtree(self._elementConfigDir)
            Logger().log_info(f'Element Config File ({self._name}) all removed')

    def getConfig(self, config_type: str) -> Optional[dict]:
        with self._apiLock:
            cfg = self._configMap.get(config_type.lower(), None)
            return copy.deepcopy(cfg) if cfg else None


class ElementCfgs:

    def __init__(self, config_dir: str, system_name: str):
        self._logger = Logger()
        self._apiLock = threading.Lock()
        self._elementBaseConfigDir = f'{config_dir}/.element/.system/{system_name}'
        self._elementCfgMap: Dict[str, ElementCfg] = {}  # key: element_id, value: ElementCfg

    @staticmethod
    def _extractConfigTypeName(filename: str) -> Optional[str]:
        if filename.startswith('.') and filename.endswith('.json'):
            return filename[1:-5]
        return None

    @staticmethod
    def _scanFile(base_path: str) -> List[Tuple[List[str], str, Dict[str, dict]]]:
        results = []
        for dirPath, dirNames, fileNames in os.walk(base_path):
            name_content_pairs = {}
            for f in fileNames:
                name = ElementCfgs._extractConfigTypeName(f)
                if name:
                    file_path = os.path.join(dirPath, f)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as file:
                            content = json.load(file)
                        name_content_pairs[name] = content
                    except Exception as e:
                        pass

            if name_content_pairs:
                rel_path = os.path.relpath(dirPath, base_path)
                parts = rel_path.split(os.sep) if rel_path != '.' else []
                if len(parts) >= 1:
                    upper_dirs = parts[:-1]
                    current_dir = parts[-1]
                    results.append((upper_dirs, current_dir, name_content_pairs))
        return results

    # key: path-str, value: config-data
    @staticmethod
    def _build_row_to_pathMap(config_type: str, rows: List[list]) -> Dict[str, dict]:
        path_map: Dict[str, dict] = {}
        for row in rows:
            if not isinstance(row, list) or len(row) < 5:
                continue
            path = row[1]
            if not isinstance(path, str):
                continue
            payload = row[4]
            if isinstance(payload, dict):
                for p_value in payload.values():
                    if not isinstance(p_value, dict):
                        continue
                    if p_value.get("type") != config_type:
                        continue
                    path_map[path] = p_value
                    break
        return path_map

    # key: config-type, value: path-map of config-type
    @staticmethod
    def _build_config_to_pathMap(data: Dict[str, List[list]]) -> Dict[str, Dict[str, dict]]:
        global_map: Dict[str, Dict[str, dict]] = {}
        for _section_name, rows in data.items():
            if isinstance(rows, list):
                path_map = ElementCfgs._build_row_to_pathMap(_section_name, rows)
                if path_map:
                    global_map[_section_name] = path_map
        return global_map

    @staticmethod
    def _is_path_like(v: str) -> bool:
        return isinstance(v, str) and v.startswith('/')

    @staticmethod
    def _resolve_reference(config_type: str, path: str, config_path_map: Dict[str, Dict[str, dict]]) -> Optional[dict]:
        row_path_map = config_path_map.get(config_type)
        if row_path_map:
            return row_path_map.get(path)
        else:
            return None

    @staticmethod
    def _build_element(path:str, path_data:dict, config_path_map: Dict[str, Dict[str, dict]]) -> Tuple[list, str, Dict[str, dict]]:
        element_parent_list = [p for p in Path(path).parts if p not in (os.sep, '')][:-1]
        element_name = path_data.get("name")
        element_value = copy.deepcopy(path_data)
        resolved: Dict[str, dict] = {ELEMENT_CFG_LIST['ELEMENT']: element_value}
        for key, val in element_value.items():
            if ElementCfgs._is_path_like(val):
                reference_value = ElementCfgs._resolve_reference(key, val, config_path_map)
                if reference_value:
                    resolved[key] = reference_value
        return element_parent_list, element_name, resolved

    @staticmethod
    def _reorder_by_elements(data: Dict[str, List[list]]) -> List[Tuple[List[str], str, Dict[str, dict]]]:
        config_path_map = ElementCfgs._build_config_to_pathMap(data)
        results: List[Tuple[list, str, Dict[str, dict]]] = []
        for config_type, path_map in config_path_map.items():
            if config_type == ELEMENT_CFG_LIST['ELEMENT']:
                for path, path_data in path_map.items():
                    results.append(ElementCfgs._build_element(path, path_data, config_path_map))
        return results

    def _deleteAllFiles(self):
        for v in self._elementCfgMap.values():
            v.removeFile()
        if self._elementBaseConfigDir and os.path.exists(self._elementBaseConfigDir):
            shutil.rmtree(self._elementBaseConfigDir)

    def _reset(self):
        self._elementCfgMap.clear()

    def load(self) -> bool:
        if not os.path.exists(self._elementBaseConfigDir):
            return False

        with self._apiLock:
            try:
                self._reset()
                scan_result = self._scanFile(self._elementBaseConfigDir)
                if scan_result:
                    for upper_dirs, current_dir, file_info in scan_result:
                        element_name = current_dir
                        element_cfg = ElementCfg(self._elementBaseConfigDir, upper_dirs, element_name, **file_info)
                        self._elementCfgMap[element_cfg.id] = element_cfg
                        self._logger.log_info(f'ElementCfgs : load : {element_name}')
                    return True
            except Exception as e:
                self._logger.log_error(f'ElementCfgs : load : fail to {e}')
            return False

    def init(self, config_data: dict, own_system_config: dict, reset: bool=False) -> bool:
        reordered_data = self._reorder_by_elements(config_data)
        if not reordered_data:
            self._logger.log_error(f'ElementCfgs : init : fail to reorder data')
            return False
        with self._apiLock:
            try:
                if reset:
                    self._deleteAllFiles()
                    self._reset()
                for upper_dirs, element_name, config_type_dict in reordered_data:
                    config_type_dict[ELEMENT_CFG_LIST['SYSTEM']] = own_system_config
                    element_cfg = ElementCfg(self._elementBaseConfigDir, upper_dirs, element_name, **config_type_dict)
                    self._elementCfgMap[element_cfg.id] = element_cfg
                    element_cfg.writeFile()
                    self._logger.log_info(f'ElementCfgs : init : {element_cfg}')
                return True
            except Exception as e:
                self._logger.log_error(f'ElementCfgs : init : fail to {e}')
                return False

    def getElementConfig(self, element_id: str, config_type: str) -> Optional[dict]:
        with self._apiLock:
            element_cfg = self._elementCfgMap.get(element_id, None)
            if element_cfg:
                return element_cfg.getConfig(config_type)
            else:
                return None

    def getElementConfigList(self) -> Generator[ElementCfg, None, None]:
        with self._apiLock:
            for v in self._elementCfgMap.values():
                yield v

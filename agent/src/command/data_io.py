import os
import json, csv
import pandas as pd



#DATA_FILE_NAME = '.data'
DATA_FILE_NAME = '.node.json'
INDEX_FILE_NAME = '.index'

ELEMENT_CFG_LIST = {
    'FORMAT':'format',
    'STORE':'store',
    'PROCESSOR':'processor',
    'SYSTEM':'system',
    'ELEMENT':'element',
}

# Data Input/Output 을 제공하는 클래스
class DataFileIo:
    def __init__(self, root_path:str, element_path:str, system=None, element=None, format=None, store=None, processor=None):
        self._root_path = root_path  # data elements root path(os absolute path)
        self._path = element_path  # element path

        self._configs = {v: None for v in ELEMENT_CFG_LIST.values()}
        self._prevConfigs = {v: None for v in ELEMENT_CFG_LIST.values()} # 이전 설정 저장용 from file

        self._configs[ELEMENT_CFG_LIST['SYSTEM']] = system
        self._configs[ELEMENT_CFG_LIST['ELEMENT']] = element
        self._configs[ELEMENT_CFG_LIST['FORMAT']] = format
        self._configs[ELEMENT_CFG_LIST['STORE']] = store
        self._configs[ELEMENT_CFG_LIST['PROCESSOR']] = processor

        self._record_info = None

        self._dataType = 'static' # static or temporary
        self._isTree = False # if True, tree structure

        self._initConfig()

    def __str__(self):
        return f'DataFileIo({self._path})'
    
    def _write_json_file(self, file_path, data):
        try:            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Error writing JSON file {file_path}: {e}")
        return False

    def _write_csv_file(self, file_path, data):
        try:
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerows(data)
            return True
        except Exception as e:
            print(f"Error writing CSV file {file_path}: {e}")
        return False

    def _read_json_file(self, file_path):
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)            
        except Exception as e:
            print(f"Error loading JSON file {file_path}: {e}")
        return None

    def _read_csv_file(self, file_path):
        try:
            if os.path.exists(file_path):
                return pd.read_csv(file_path)
        except Exception as e:
            print(f"Error loading CSV file {file_path}: {e}")
        return None
    
    # 기존 설정되 정보와 현재 설정된 정보 비교 후 변경된 경우 파일에 기록
    def _update_config(self, type:str, new_config):
        #print(f"DataFileIo({self._path}) : type={type}, cfg={new_config}")
        if type not in ELEMENT_CFG_LIST.values():
            print(f"DataFileIo({self._path}) : update_config error : invalid type {type}")
            return False

        file_path = f'{self._root_path}{self._path}/.{type}.json'

        if new_config is None:
            # admin config loading case
            prev_config = self._read_json_file(file_path)
            if prev_config is None:
                return False
            self._configs[type] = prev_config
            return True
        else:
            prev_config = self._read_json_file(file_path)
            if new_config != prev_config:
                print(f"DataFileIo({self._path}) : {type} config is changed({file_path})")
                self._write_json_file(file_path, new_config)
                return True
        return False

    # 외부 호출용 함수
    def update_config(self, type:str, cfg_data):
        return self._update_config(type, cfg_data)
        
    def _reset_config(self):
        for cfg_type in ELEMENT_CFG_LIST.values():
            self._update_config(cfg_type, self._configs[cfg_type])

    def _initConfig(self):
        # 1. element 디렉토리가 없으면 새로 생성
        if not os.path.exists(f'{self._root_path}{self._path}'):
            print(f"DataFileIo({self._path}) : Create Element Directory!")  
            os.makedirs(f'{self._root_path}{self._path}')

        # 2 element config 디렉토리 체크(설정데이터 기존 / 신규 비교 or 신규 생성)
        for cfg_type in ELEMENT_CFG_LIST.values():
            self._update_config(cfg_type, self._configs[cfg_type])
        
        # 3. config 에 따라 데이터 속성/로딩 방식 반영
        if self._configs[ELEMENT_CFG_LIST["ELEMENT"]] is None or self._configs[ELEMENT_CFG_LIST["FORMAT"]] is None or self._configs[ELEMENT_CFG_LIST["STORE"]] is None or self._configs[ELEMENT_CFG_LIST["PROCESSOR"]] is None:
            # for admin config loading    
            print(f"DataFileIo({self._path}) : admin config loading!")  
            self._dataType = 'static'
            self._isTree = True
        else:    # general case
            self._dataType = self._configs['format'].get("dataType", "static") # static or temporary
            #if not self._data_type in ['static', 'temporary']:
            #    self._data_type = 'static' # default
        
            if(self._dataType == 'static'):
                print(f"DataFileIo({self._path}): static data")
                self._isTree = self._configs['format'].get("isTree", False) # if True, tree structure
            # if True, data-row : [index, path, data_row]
                # if False, data-row : [index, data_row]
            
            if(self._dataType == 'temporary'):
                print(f"DataFileIo({self._path}): temporary data")

                self._recordUnit = self._configs['store'].get("record", {}).get("unit", "NONE")
                self._recordBlock = self._configs['store'].get("record", {}).get("block", "NONE")
                self._expireUnit = self._configs['store'].get("record", {}).get("expireUnit", "NONE")
                self._expire = self._configs['store'].get("record", {}).get("expire", -1)

            self._recordStorage = self._configs['store'].get("record", {}).get("storage", "DISK")

        # 4. 데이터 index 파일 로딩(없으면 신규 생성)
        index_columns = []
        if self._dataType == 'static' and self._isTree:
            index_columns = ['index', 'path', 'name']
        elif self._dataType == 'static' and not self._isTree:
            index_columns = ['index', 'path']
        elif self._dataType == 'temporary':
            index_columns = ['time', 'path']

        file_path = f'{self._root_path}{self._path}/{INDEX_FILE_NAME}'
        self._record_info = self._read_csv_file(file_path)
        if self._record_info is None :
            self._write_csv_file(file_path, [index_columns])
        else: 
            # index file exists
            # check columns
            if not all(col in self._record_info.columns for col in index_columns):
                print(f"DataFileIo({self._path}) : record info columns are not valid, recreate index file")
                self._write_csv_file(file_path, [index_columns])
                    

    # 전체 데이터 가져오기
    def get(self, start_offset:str='0', end_offset:str='0'):
        if self._record_info is not None:
            # 1. get record info
            records = []
            if(self._dataType == 'static'):
                if self._isTree:
                    # tree structure
                    for _, row in self._record_info.iterrows():
                        index = row['index']
                        path = row['path']
                        name = row['name']
                        
                        data_file_path = f'{self._root_path}{self._path}/{path}/{DATA_FILE_NAME}'
                        #print(f"Loading data from {data_file_path}")
                        data_row = self._read_json_file(data_file_path)
                        if data_row is not None:
                            records.append( [index, path, data_row] )
                else:
                    # flat structure
                    for _, row in self._record_info.iterrows():
                        path = row['path']
                        data_file_path = f'{self._root_path}{self._path}/{path}/{DATA_FILE_NAME}'
                        data_rows = self._read_csv_file(data_file_path)
                        if data_rows is not None:
                            for data_row in data_rows:
                                records.append([data_row])

                                
            elif(self._dataType == 'temporary'): # temporary
                # self._recordBlock : NONE, HOUR, DAY, WEEK, MONTH, YEAR 에따라 디렉토리 구성 변경
                if self._recordBlock == "NONE":
                    # Error case
                    print("Temporary data with 'NONE' block is not supported.")
                    return None
                
                for _, row in self._record_info.iterrows():
                    index = row['index']
                    path = row['path']
                    name = row['name']
                    data_file_path = f'{self._root_path}{self._path}/{path}/{DATA_FILE_NAME}'
                    data_rows = self._read_csv_file(data_file_path)
                    if data_rows is not None:
                        records.append( [list(data_rows)] )
        
            return records
        return []
    
    # 전체 데이터 쓰기 
    def put(self, datas):
        # 1. save data 
        # 1.1. write data file

        # 1.2. failed back if error
        
        
        # 3. update record info
        # update index file
        return True
        
   
if __name__ == '__main__':

    dataio = DataFileIo("./config_nex", "/admin/element")
    
    data = dataio.get()

    print("data:", json.dumps(data, ensure_ascii=False, indent=2))

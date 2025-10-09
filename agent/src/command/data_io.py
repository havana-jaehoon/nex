import os
import json, csv
import pandas as pd

from agent.src.system_info import SystemInfoMgr

DATA_FILE_NAME = '.data'
INDEX_FILE_NAME = '.index.csv'

ELEMENT_FILE_NAME = '.element.json'
FORMAT_FILE_NAME = '.format.json'
STORE_FILE_NAME = '.store.json'
PROCESSOR_FILE_NAME = '.processor.json'

# Data Input/Output 을 제공하는 클래스
class DataFileIo:
    def __init__(self, root_path:str, element_path:str):
        self._root_path = root_path  # admin root path
        self._element_path = element_path  # element path
        self._path = f'{self._root_path}/{self._element_path}'  # data_io path
        self._elements = None
        self._format = None
        self._store = None
        self._processor = None
        self._record_info = None

        self._dataType = 'static' # static or temporary
        self._isTree = False # if True, tree structure

        self._load_config()

    def __str__(self):
        return f'DataIo({self._path})'
    

    def _load_json_file(self, file_path):
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading JSON file {file_path}: {e}")
        return None
    
    def _load_csv_file(self, file_path):
        try:
            if os.path.exists(file_path):
                return pd.read_csv(file_path)
        except Exception as e:
            print(f"Error loading CSV file {file_path}: {e}")
        return None

    def _load_config(self):
        try: 
            # 1. load element config
            file_path = f'{self._path}/{ELEMENT_FILE_NAME}'
            self._elements = self._load_json_file(file_path)
            if not self._elements:
                raise Exception(f"DataIo({self._path}) : element config is not valid")

            # 2. load format config
            file_path = f'{self._path}/{FORMAT_FILE_NAME}'
            self._format = self._load_json_file(file_path)
            if not self._format:
                raise Exception(f"DataIo({self._path}) : format config is not valid")
            
            self._dataType = self._format.get("dataType", "static") # static or temporary
            #if not self._data_type in ['static', 'temporary']:
            #    self._data_type = 'static' # default
            
            if(self._dataType == 'static'):
                self._isTree = self._format.get("isTree", False) # if True, tree structure
                # if True, data-row : [index, path, data_row]
                # if False, data-row : [index, data_row]


            # 3. load store config
            file_path = f'{self._path}/{STORE_FILE_NAME}'
            self._store = self._load_json_file(file_path)
            if not self._store:
                raise Exception(f"DataIo({self._path}) : store config is not valid")
            
            if(self._dataType == 'temporary'):
                self._recordUnit = self._store.get("record", {}).get("unit", "NONE")
                self._recordBlock = self._store.get("record", {}).get("block", "NONE")
                self._expireUnit = self._store.get("record", {}).get("expireUnit", "NONE")
                self._expire = self._store.get("record", {}).get("expire", -1)

            self._recordStorage = self._store.get("record", {}).get("storage", "DISK")
 

            # 4. load processor config
            file_path = f'{self._path}/{PROCESSOR_FILE_NAME}'
            self._processor = self._load_json_file(file_path)
            if not self._processor:
                raise Exception(f"DataIo({self._path}) : processor config is not valid")
            # 5. load record info (data)
            file_path = f'{self._path}/{INDEX_FILE_NAME}'
            self._record_info = self._load_csv_file(file_path)
            if self._record_info is None:
                raise Exception(f"DataIo({self._path}) : record info is not valid")

        except Exception as e:
            print(f"DataIo({self._path}) : load config error : {e}")
            self._elements = None
            self._format = None
            self._store = None
            self._processor = None
            self._record_info = None

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
                        data_file_path = f'{self._path}/{path}/{DATA_FILE_NAME}'
                        data_row = self._load_json_file(data_file_path)
                        if data_row is not None:
                            records.append( [index, path, data_row] )
                else:
                    # flat structure
                    for _, row in self._record_info.iterrows():
                        index = row['index']
                        data_file_path = f'{self._path}/{path}/{DATA_FILE_NAME}'
                        data_rows = self._load_csv_file(data_file_path)
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
                    data_file_path = f'{self._path}/{index}.json'
                    data_row = self._load_json_file(data_file_path)
                    if data_row is not None:
                        records.append( [index, data_row] )

                if not os.path.exists(data_file_path):
                    print(f"Format file does not exist at {data_file_path}")
                    return None

                with open(data_file_path, 'r', encoding='utf-8') as f:
                    records.append([list(csv.reader(f))])
                return []
            
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

    dataio = DataFileIo("./config_nex", "/admin/format")
    
    data = dataio.get()

    print("data:", json.dumps(data, ensure_ascii=False, indent=2))

import os
import json, csv
import pandas as pd
from collections import defaultdict



#DATA_FILE_NAME = '.node.json'
#INDEX_FILE_NAME = '.index'

DATA_FILE_NAME = '.records'
INDEX_FILE_NAME = '.index'

DATA_DIR_NAME = '.data'

# 1 file 당 100개 레코드 저장
DATA_BLOCK_SIZE = 100  

# 1 디렉토리 당 10개의 파일 저장
DATA_FILE_COUNT = 10

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
        # root_path : data elements root path(os absolute path)
        self._elementPath = element_path  # element path

        # 시스템 별로 element 데이터 폴더를 만들기 위한 경로
        # system 이 None 이면 Config Reeader only 용으로 사용
        self._systemPath = f'/.system/{system.get("name", "")}' if system is not None else ""
        self._elementFullPath = f'{root_path}{self._systemPath}{self._elementPath}'

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
        self.index_columns = []

        self._initConfig()

    def __str__(self):
        return f'DataFileIo({self._elementFullPath})'
    
    def _write_json_file(self, file_path, data):
        try:
            dir_full_path = os.path.dirname(file_path)
            if not os.path.exists(dir_full_path):
                os.makedirs(dir_full_path)            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Error writing JSON file {file_path}: {e}")
        return False

    def _write_csv_file(self, file_path, data):
        try:
            dir_full_path = os.path.dirname(file_path)
            if not os.path.exists(dir_full_path):
                os.makedirs(dir_full_path)
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
        #print(f"{self.__str__()} : type={type}, cfg={new_config}")
        if type not in ELEMENT_CFG_LIST.values():
            print(f"{{self.__str__()}} : update_config error : invalid type {type}")
            return False

        file_path = f'{self._elementFullPath}/.{type}.json'

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
                print(f"{self.__str__()} : {type} config is changed({file_path})")
                self._write_json_file(file_path, new_config)
                return True
        return False

    # 외부 호출용 함수
    def update_config(self, type:str, cfg_data):
        return self._update_config(type, cfg_data)
        
    def _initConfig(self):
        # 1. element 디렉토리가 없으면 새로 생성
        if not os.path.exists(self._elementFullPath):
            print(f"{self.__str__()} : Create Element Directory!")
            os.makedirs(self._elementFullPath)

        # 2 element config 디렉토리 체크(설정데이터 기존 / 신규 비교 or 신규 생성)
        for cfg_type in ELEMENT_CFG_LIST.values():
            self._update_config(cfg_type, self._configs[cfg_type])
        
        # 3. config 에 따라 데이터 속성/로딩 방식 반영
        if self._configs[ELEMENT_CFG_LIST["ELEMENT"]] is None or self._configs[ELEMENT_CFG_LIST["FORMAT"]] is None or self._configs[ELEMENT_CFG_LIST["STORE"]] is None or self._configs[ELEMENT_CFG_LIST["PROCESSOR"]] is None:
            # for
            print(f"{self.__str__()} : None attribute(format | store | processor)!")
            self._dataType = 'static'
            self._isTree = True
        else:    # general case
            self._dataType = self._configs['format'].get("dataType", "static") # static or temporary
            #if not self._data_type in ['static', 'temporary']:
            #    self._data_type = 'static' # default
        
            if(self._dataType == 'static'):
                print(f"{self.__str__()}: static data")
                self._isTree = self._configs['format'].get("isTree", False) # if True, tree structure
            
            if(self._dataType == 'temporary'):
                print(f"{self.__str__()}: temporary data")

                self._recordUnit = self._configs['store'].get("record", {}).get("unit", "NONE")
                self._recordBlock = self._configs['store'].get("record", {}).get("block", "NONE")
                self._expireUnit = self._configs['store'].get("record", {}).get("expireUnit", "NONE")
                self._expire = self._configs['store'].get("record", {}).get("expire", -1)

            self._recordStorage = self._configs['store'].get("record", {}).get("storage", "DISK")

        # 4. 데이터 index 파일 로딩(없으면 신규 생성)
        if self._dataType == 'static' and self._isTree:
            self._blockSize = 1
            self.index_columns = ['index', 'path'] 
        elif self._dataType == 'static' and not self._isTree:
            self._blockSize = DATA_BLOCK_SIZE
            self.index_columns = ['index', 'path']
        elif self._dataType == 'temporary':
            self.index_columns = ['time', 'path']

        file_path = f'{self._elementFullPath}/{INDEX_FILE_NAME}'
        self._record_info = self._read_csv_file(file_path)
        if self._record_info is None :
            self._write_csv_file(file_path, [self.index_columns])
        else: 
            # index file exists
            # check columns
            if not all(col in self._record_info.columns for col in self.index_columns):
                print(f"{self.__str__()} : record info columns are not valid, recreate index file")
                self._write_csv_file(file_path, [self.index_columns])


    # 전체 데이터 가져오기
    def get(self, start_offset:str='0', end_offset:str='0'):
        if self._record_info is not None:
            # 1. get record info
            records = []
            if(self._dataType == 'static'): # static & tree
                if self._isTree:
                    # tree structure
                    for _, row in self._record_info.iterrows():
                        index = row['index']
                        file_path = row['path']

                        dir_path = os.path.dirname(file_path)

                        data_file_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'
                        #print(f"Loading data from {data_file_path}")
                        data_row = self._read_json_file(data_file_path)
                        if data_row is not None:

                            if(data_row[0] != index or data_row[1] != dir_path):
                                print(f"{self.__str__()} : record mismatch, index={index}/{data_row[0]}, path={dir_path}/{data_row[1]}")
                                continue
                            records.append( data_row )
                else:
                    # flat structure
                    for _, row in self._record_info.iterrows():
                        file_path = row['path']
                        data_file_path = f'{self._elementFullPath}/{file_path}'
                        data_rows = self._read_csv_file(data_file_path)
                        if data_rows is not None:
                            records.append( [list(data_rows)] )
                                                            
            elif(self._dataType == 'temporary'): # temporary
                # self._recordBlock : NONE, HOUR, DAY, WEEK, MONTH, YEAR 에따라 디렉토리 구성 변경
                if self._recordBlock == "NONE":
                    # Error case
                    print("Temporary data with 'NONE' block is not supported.")
                    return None
                
                for _, row in self._record_info.iterrows():
                    time = row['time']
                    file_path = row['path']
                    data_file_path = f'{self._elementFullPath}/{file_path}'
                    data_rows = self._read_csv_file(data_file_path)
                    if data_rows is not None:
                        records.append( [list(data_rows)] )
        
            return records
        return []
    
    def put(self, data):
        return None
    
    def update(self, data):
        return None
    
    # 전체 데이터 쓰기 
    def set(self, datas):
        # 1. save data 
        # 1.1. write data file

        index_datas = []
        if self._dataType == 'static' and self._isTree:
            # 1 record per file for admin config
            for data in datas:
                index = data[0]
                path = data[1]
                project = data[2] # project name
                system = data[3] # system name
                object = data[4] # json object for admin config

                #element has  index, path, system, object

                file_path = f'{path}/{DATA_FILE_NAME}'
                file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'

                self._write_json_file(file_full_path, [index, path, project, system, object])
                #index_columns.append(['index', 'path'])
                index_datas.append([index, file_path])

        elif self._dataType == 'static':
            dir_path = f'{DATA_DIR_NAME}'
            for i in range(0, len(datas), DATA_BLOCK_SIZE):
                block = datas[i:i + DATA_BLOCK_SIZE]
                if i > 0 and (i % DATA_FILE_COUNT) == 0:
                    # new directory
                    dir_index = i // DATA_FILE_COUNT
                    dir_path = f'{dir_path}/{dir_index}'
                    dir_full_path = f'{self._elementFullPath}/{dir_path}'
                    if not os.path.exists(dir_full_path):
                        print(f"Create data directory: {dir_full_path}")
                        os.makedirs(dir_full_path)

                file_path = f'{dir_path}/{i}'
                file_full_path = f'{self._elementFullPath}/{file_path}'
                self._write_json_file(file_full_path, block)
                index_datas.append([i * DATA_BLOCK_SIZE, file_path])

        elif self._dataType == 'temporary':
            # YYYY-MM-DD-HH:MM:SS.XXX or YYYY-MM-DD-HH:MM:SS or YYYY-MM-DD-HH:MM or 
            # YYYY-MM-DD-HH or YYYY-MM-DD or YYYY-MM or YYYY
            data_map = {}
            file_path_map = {}
            for row in datas:
                time = row[0] # time string format: YYYY/MM/DD/HH/MM

                if self._recordBlock == "YEAR":
                    if time.__len__() < 7:
                        print(f"Temporary data time format error: {time}")
                        continue
                    cur_dir = f'{time[0:4]}'
                    cur_file = f'{time[0:7]}'
                elif self._recordBlock == "MONTH":
                    if time.__len__() < 10:
                        print(f"Temporary data time format error: {time}")
                        continue
                    cur_dir = f'{time[0:4]}/{time[5:7]}'
                    cur_file = f'{time[0:10]}'
                elif self._recordBlock == "DAY":
                    if time.__len__() < 13:
                        print(f"Temporary data time format error: {time}")
                        continue
                    cur_dir = f'{time[0:4]}/{time[5:7]}/{time[8:10]}'
                    cur_file = f'{time[0:13]}'
                elif self._recordBlock == "HOUR":
                    if time.__len__() < 16:
                        print(f"Temporary data time format error: {time}")
                        continue
                    cur_dir = f'{time[0:4]}/{time[5:7]}/{time[8:10]}/{time[11:13]}'
                    cur_file = f'{time[0:13]}{time[14:16]}'
                elif self._recordBlock == "MINUTE":
                    if time.__len__() < 19:
                        print(f"Temporary data time format error: {time}")
                        continue
                    cur_dir = f'{time[0:4]}/{time[5:7]}/{time[8:10]}/{time[11:13]}/{time[14:16]}'
                    cur_file = f'{time[0:13]}{time[14:16]}{time[17:19]}'
                else:
                    # Error case
                    print(f"Temporary data with invalid block '{self._recordBlock}' is not supported.")
                    return False
                
                # add data to data_file_map for batch write
                file_path = f'{cur_dir}/{cur_file}'
                file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'
                dir_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{cur_dir}'
                if cur_file not in data_map:
                    # create new file entry            
                    self._write_csv_file(file_full_path, [self.index_columns]) # header
                    
                    data_map[cur_file] = []
                    file_path_map[cur_file] = file_path

                data_map[cur_file].append(row)

            for cur_file, file_path in file_path_map.items():
                rows = data_map[cur_file]
                file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'

                self._write_csv_file(file_full_path, rows)
                index_datas.append([cur_file, file_path])
                
        #print(f"{self.__str__()}::put({len(datas)})")
        #print(f"{json.dumps(datas, ensure_ascii=False, indent=2)}")
        # 1.2. failed back if error


        # 3. update record info
        # update index file
        #print(f"{self.__str__()}::set() - index_datas: {[self.index_columns]+index_datas}")
        file_path = f'{self._elementFullPath}/{INDEX_FILE_NAME}'
        self._write_csv_file(file_path, [self.index_columns]+index_datas)

        return True
        
    def upgrade(self):
        records = self.get()
        if records is None or len(records) == 0:
            return False
        
        node = records[0][4]

        keys = list(node.keys())
        values = list(node.values())
        
        if(len(keys) == 1 and keys[0].isdigit()):
            # 새로운 설정포맷이 적용된 데이터
            print(f"{self.__str__()}::upgrade() - upgrade done already")
            return False
        
        child_count_per_path = {}
        for record in records:
            path = record[1]
            parent_path = os.path.dirname(path)
            if parent_path not in child_count_per_path:
                child_count_per_path[parent_path] = 0
                #print("# New parent path:", parent_path)
            else :               
                child_count_per_path[parent_path] += 1

            #new_record = record[:]  # Create a copy
            record[4] = {str(child_count_per_path[parent_path]): record[4]}

        
        self.set(records)
        print(f"{self.__str__()}::upgrade() - new upgrade done")
        return True
   
if __name__ == '__main__':

    dataio = DataFileIo("./config_nex", "/admin/element")
    
    data = dataio.get()

    print("data:", json.dumps(data, ensure_ascii=False, indent=2))

import os
import json, csv
import pandas as pd
from collections import defaultdict
from datetime import datetime



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

# Supported formats, from longest to shortest
timeFormats = [
    "%Y-%m-%d %H:%M:%S",  # 가장 많이 사용되는 형식
    "%Y-%m-%d %H:%M:%S.%f", # 마이크로초 포함 형식 (예: 2023-10-05-14:30:15.123456)
    "%Y-%m-%d %H:%M",
    "%Y-%m-%d %H",
    "%Y-%m-%d",
    "%Y-%m",
    "%Y"
    ]

dirFormats = {
    'YEAR' : "%Y",
    'MONTH' : "%Y%m",
    'DAY' : "%Y/%m/%d",
    'HOUR' : "%Y/%m/%d/%H",
    'MIN' : "%Y/%m/%d/%H/%M",
}

fileFormats = {
    'YEAR' : "%Y%m",
    'MONTH' : "%Y%m%d",
    'DAY' : "%Y%m%d%H",
    'HOUR' : "%Y%m%d%H%M",
    'MIN' : "%Y%m%d%H%M%S",
}

def convTimeToPath(time_str, format= "DAY"):
    
    dt_obj = None
    for fmt in timeFormats:
        try:
            #print(f"Parsed time '{time_str}' using format '{fmt}'")
            dt_obj = datetime.strptime(time_str, fmt)

            #print(f"Parsed time '{time_str}' using format '{fmt}' -> {dt_obj}")
            break  # Found a matching format
        except ValueError:
            continue # Try the next format

    if dt_obj is None:
        print(f"Error processing time '{time_str}': does not match any supported format.")
        return None, None

    try:
        # dt_obj is now a datetime object, possibly with default values for missing parts.
        # We can now format it as needed.
        dir_path = dt_obj.strftime(dirFormats[format])
        file_name = dt_obj.strftime(fileFormats[format])

        return dir_path, file_name

    except Exception as e:
        print(f"Error formatting time '{time_str}': {e}")
        return None, None


def convIndexToPath(index: int):
    """
    인덱스를 기반으로 계층적 디렉토리 경로와 파일 이름을 계산합니다.
    - 각 데이터 파일은 DATA_BLOCK_SIZE(100)개의 레코드를 저장합니다.
    - 각 디렉토리는 DATA_FILE_COUNT(10)개의 데이터 파일 또는 하위 디렉토리를 포함합니다.
    """
    if not isinstance(index, int) or index < 0:
        return None, None

    # 레코드 인덱스를 기반으로 파일 인덱스를 계산합니다.
    # 예: 인덱스 0-99 -> file_index 0; 인덱스 100-199 -> file_index 1
    file_index = index // DATA_BLOCK_SIZE
    file_name = f".record_{file_index}"

    # 파일 인덱스를 기반으로 디렉토리 경로를 계산합니다.
    # 각 디렉토리 레벨은 10개의 항목(파일 또는 하위 디렉토리)을 포함합니다.
    if file_index < DATA_FILE_COUNT:
        # 첫 10개 파일(file_index 0-9)은 루트에 위치합니다.
        dir_path = ''
    else:
        path_parts = []
        temp_index = file_index
        while temp_index > 0:
            part = temp_index % DATA_FILE_COUNT
            path_parts.append(str(part))
            temp_index //= DATA_FILE_COUNT
        
        # 마지막 부분은 파일 이름이므로 경로에서 제외합니다.
        # 경로는 가장 높은 레벨부터 구성됩니다.
        dir_path = "/".join(reversed(path_parts[:-1]))

    return dir_path, file_name




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
        self._records = []

        self._dataType = 'static' # static or temporary
        self._isTree = False # if True, tree structure
        self.index_columns = []
        self.data_columns = []


        self._initConfig()
        self._loadData()

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

    def _read_csv_file(self, file_path)-> list:
        try:
            if os.path.exists(file_path):
                return pd.read_csv(file_path).values.tolist()
        except Exception as e:
            print(f"Error loading CSV file {file_path}: {e}")
        return None
    
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
            self._dataType = self._configs['store'].get('record', {}).get("nature", "static") # static or temporary
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

        # 데이터 컬럼 정보 설정
        features = self._configs['format'].get('features', [])
        for feature in features:
            featureName = feature['name']
            self.data_columns.append(featureName)

        self.index_columns = ['index', 'path']

        # 4. record info (index) 파일 로딩                
        file_path = f'{self._elementFullPath}/{INDEX_FILE_NAME}'
        self._record_info = self._read_csv_file(file_path)

        if self._record_info is None:
            # index file does not exist, create a new one with headers
            print(f"{self.__str__()} : record info file not found. Creating new one.")
            self._write_csv_file(file_path, [self.index_columns])
            self._record_info = self._read_csv_file(file_path)
        
        
    def _loadData(self):
        self._records = self.get(0, 0) # load all data


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
    def updateConfig(self, type:str, cfg_data):
        return self._update_config(type, cfg_data)
        

    # 전체 데이터 가져오기
    def get(self, start_offset:str='0', end_offset:str='0'):
        if self._record_info is not None:
            # 1. get record info
            records = []
            if(self._dataType == 'static'): # static & tree
                # start_offset, end_offset : index format (int)
                sIndex = int(start_offset)
                eIndex = int(end_offset)
                # index 범위에 따른 데이터 로딩

            elif(self._dataType == 'temporary'): # temporary
                # start_offset, end_offset : time string format: YYYY/MM/DD/HH/MM 
                sTime = start_offset
                eTime = end_offset\
                # time 범위에 따른 데이터 로딩

            # 모든 데이터 로딩    
            for index, file_path in self._record_info:
                #print(f"# Load data file: index={index}, path={file_path}")
                file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'
                data_rows = self._read_json_file(file_full_path)
                if data_rows is not None:
                    records.extend(data_rows)
                                                            
            return records
        return []
    
    def add(self, data): 
        self._records.append(data)
        
        return None
    
    def update(self, data):
        return None
    
    def delete(self, data):
        return None
    
    # 전체 데이터 쓰기 
    def set(self, datas):
        # 1. save data 
        # 1.1. write data file

        if datas is None or len(datas) == 0:
            print(f"{self.__str__()}::set() - no data to save")
            return False
        
        #print(f"{self.__str__()}::set() - total {datas} records to save")  
        index_datas = []
        new_records = []
        print(f"### 0")
        if self._dataType == 'static' and self._isTree:
            print(f"### 0-1")
            # admin 설정 데이터는 업로드 하지 않음(임시)
            # 1 record per file for admin config
            #data_map = {}
            #data_map[DATA_FILE_NAME] = { 'index': 0, 'path': f'/{DATA_FILE_NAME}', 'data': datas }
            print(f"{self.__str__()}::set-config - total {len(datas)} records ")
            return False
        
        elif self._dataType == 'static':
            print(f"### 0-2")
            print(f"{self.__str__()}::set() - static data saving")

            data_map = {}
            for i in range(0, len(datas), DATA_BLOCK_SIZE):
                print(f"### 0-2-1 : i={i}")
                block = datas[i:i + DATA_BLOCK_SIZE]
                index = i * DATA_BLOCK_SIZE
                dir_path, file_name = convIndexToPath(index)


                
                print(f"### 0-2-2 : i={i}")

                file_path = f'{dir_path}/{file_name}'
                print(f"### 0-2-3 : i={i}")
                data_map[file_name] = { 'index': i, 'path': file_path, 'data': block }
                print(f"### 0-2-4 : i={i}")
                print(f"{self.__str__()}::set() - block: index={i}, path={file_path}, records={block}")

            print(f"{self.__str__()}::set-data - total {len(data_map.keys())} blocks ")

        elif self._dataType == 'temporary':
            print(f"### 0-3")
            # YYYY-MM-DD-HH:MM:SS.XXX or YYYY-MM-DD-HH:MM:SS or YYYY-MM-DD-HH:MM or 
            # YYYY-MM-DD-HH or YYYY-MM-DD or YYYY-MM or YYYY
            print(f"{self.__str__()}::set() - temporary data saving")

            data_map = {}
            file_path_map = {}
            for row in datas:
                time = row[0] # time string format: YYYY/MM/DD/HH/MM

                dir_path, file_name = convTimeToPath(time, self._recordBlock)                  
                file_path = f'{dir_path}/{file_name}'

                #file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{file_path}'
                #dir_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{cur_dir}'
                if file_name not in data_map:
                    data_map[file_name] = { 'index': time, 'path': file_path, 'data': [] }

                data_map[file_name]['data'].append(row)

        # batch write data files & build index data
        print(f"### 1")
        for file_name, data_info in data_map.items():
            file_full_path = f'{self._elementFullPath}/{DATA_DIR_NAME}/{data_info["path"]}'

            self._write_json_file(file_full_path, data_info.get('data', []))
            index_datas.append([data_info["index"], data_info["path"]])

            print(f"{self.__str__()}::set() - write: {file_name} -> {file_full_path}")
 
        #print(f"{self.__str__()}::put({len(datas)})")
        #print(f"{json.dumps(datas, ensure_ascii=False, indent=2)}")
        # 1.2. failed back if error

        print(f"### 2")
        # 3. update record info (write index file)
        # update index file
        #print(f"{self.__str__()}::set() - index_datas: {[self.index_columns]+index_datas}")
        file_path = f'{self._elementFullPath}/{INDEX_FILE_NAME}'
        self._write_csv_file(file_path, [self.index_columns]+index_datas)
        self._record_info = [self.index_columns]+index_datas

        self._record_info = self._read_csv_file(file_path)

        #print(f"{self.__str__()}::set() - record_info: {json.dumps(self._record_info, ensure_ascii=False, indent=2)}")

        return True
    
    def upgrade2(self):
        records = self.get()
        self.set(records)

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

import json, os
from abc import ABC, abstractmethod

from util.log_util import Logger


class AuthBase(ABC):

    LOCAL_AUTH_INFO_FILE_NAME = ".auth_info.json"

    def __init__(self, base_dir: str):
        self._logger = Logger()
        self._authInfoFilePath:str = f'{base_dir}/{AuthBase.LOCAL_AUTH_INFO_FILE_NAME}'
        self._projectName:str = ''
        self._systemName:str = ''
        self._authPayload: dict = {}
        self._isAuth: bool = False

    def __str__(self):
        return f'project={self._projectName}, system={self._systemName}, authPayload={self._authPayload}'

    def _init(self, project_name: str, system_name: str, **kwargs) -> bool:
        try:
            with open(self._authInfoFilePath, 'w', encoding='utf-8') as f:
                data = { "project": project_name, "system": system_name }
                data.update(kwargs)
                json.dump(data, f, indent=4, ensure_ascii=False)
                self._projectName = project_name
                self._systemName = system_name
                self._authPayload = kwargs
                self._isAuth = True
                self._logger.log_info(f'AuthBase : LocalAuthInfo File write : {data}')
            return True
        except Exception as e:
            self._logger.log_error(f'AuthBase : LocalAuthInfo File write fail : {e}')
            return False

    def load(self) -> bool:
        if not os.path.exists(self._authInfoFilePath):
            return False
        try:
            with open(self._authInfoFilePath, 'r', encoding='utf-8') as f:
                data: dict = json.load(f)
                self._projectName = data.get('project')
                self._systemName = data.get('system')
                del data['project']
                del data['system']
                self._authPayload = data
                self._logger.log_info(f'AuthBase : LocalAuthInfo File load : {self}')
                return True
        except Exception as e:
            self._logger.log_error(f'AuthBase : LocalAuthInfo File load fail : {e}')
            return False

    @abstractmethod
    def init(self):
        pass

    @property
    def projectName(self) -> str:
        return self._projectName

    @property
    def systemName(self) -> str:
        return self._systemName

    @property
    def authPayload(self) -> dict:
        return self._authPayload

    @property
    def isAuth(self) -> bool:
        return self._isAuth
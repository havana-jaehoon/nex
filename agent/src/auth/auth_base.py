import json, os
from abc import ABC, abstractmethod

from auth.token.token_base import TokenBase
from util.module_loader import ModuleLoader
from util.log_util import Logger


class AuthBase(ABC):

    LOCAL_AUTH_INFO_FILE_NAME = ".auth_info.json"

    def __init__(self, config_dir: str, src_dir: str, secret_key: str):
        self._logger = Logger()
        self._authInfoFilePath = f'{config_dir}/{AuthBase.LOCAL_AUTH_INFO_FILE_NAME}'
        self._srcDir = src_dir
        self._tokenDir = f'{src_dir}/auth/token'
        self._secretKey = secret_key
        self._projectName = None
        self._systemName = None
        self._authPayload = {}
        self._isAuth = False

    def __str__(self):
        return f'project={self._projectName}, system={self._systemName}, authPayload={self._authPayload}'

    def _loadTokenObj(self, token_method: str):
        token_obj = ModuleLoader.loadModule(self._tokenDir, '', os.path.basename(token_method))
        if token_obj is None or not isinstance(token_obj, TokenBase):
            raise SystemExit(f"token method({token_method}) is not valid")
        return token_obj

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
    def init(self, **kwargs):
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
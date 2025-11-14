import os
from enum import Enum, auto
from typing import Optional

from util.singleton import SingletonInstance


class SystemType(Enum):
    ADMIN = auto()
    CONFIG = auto()
    AGENT = auto()


class SystemInfoMgr(SingletonInstance):
    LOG_SUBDIR = 'logs'
    SRC_SUBDIR = 'src'

    def _on_init_once(self, arg_info: dict):
        self._baseDir = None
        self._configDir = None
        self._logDir = None
        self._srcDir = None
        self._adminDataDir = None
        self._agentId = None
        self._secretKey = None
        self._type = None
        self._projectName = None
        self._configServerIp = None
        self._configServerPort = None

        self._baseDir = f'{os.path.dirname(os.path.abspath(__file__))}/..'
        config_subdir = arg_info.get('config_dir')
        if config_subdir:
            self._configDir = f'{self._baseDir}/{config_subdir}'
        else:
            self._configDir = f'{self._baseDir}'
        if not os.path.exists(self._configDir):
            os.makedirs(self._configDir, exist_ok=True)
        self._logDir = f'{self._baseDir}/{SystemInfoMgr.LOG_SUBDIR}'
        self._srcDir = f'{self._baseDir}/{SystemInfoMgr.SRC_SUBDIR}'
        self._agentId = arg_info.get('agent_id')
        if not self._agentId:
            raise Exception('agent-id is not valid')
        if self._agentId.upper() == SystemType.ADMIN.name.upper():
            self._setAdminInfo(arg_info)
        elif self._agentId.upper() == SystemType.CONFIG.name.upper():
            self._setConfigInfo(arg_info)
        else:
            self._setAgentInfo(arg_info)

    def _setAdminInfo(self, arg_info: dict):
        self._type = SystemType.ADMIN

    def _setConfigInfo(self, arg_info: dict):
        self._type = SystemType.CONFIG
        self._secretKey = arg_info.get('secret_key')
        if not self._secretKey:
            raise Exception('secret-key is not valid')
        self._projectName = arg_info.get('project')
        if not self._projectName:
            raise Exception('project is not valid')
        admin_data_subdir = arg_info.get('data_dir')
        self._adminDataDir = f"{self._baseDir}/{admin_data_subdir}"

    def _setAgentInfo(self, arg_info: dict):
        self._type = SystemType.AGENT
        self._secretKey = arg_info.get('secret_key')
        if not self._secretKey:
            raise Exception('secret-key is not valid')
        self._configServerIp = arg_info.get('cfgServer_ip')
        self._configServerPort = arg_info.get('cfgServer_port')
        if not self._configServerIp or not self._configServerPort:
            raise Exception('cfgServer-ip or cfgServer-Port is not valid')

    @property
    def base_dir(self) -> str:
        return self._baseDir

    @property
    def src_dir(self) -> str:
        return self._srcDir

    @property
    def log_dir(self) -> str:
        return self._logDir

    @property
    def config_dir(self) -> str:
        return self._configDir

    @property
    def admin_data_dir(self) -> Optional[str]:
        return self._adminDataDir

    @property
    def projectName(self) -> Optional[str]:
        return self._projectName

    @property
    def agentId(self) -> str:
        return self._agentId

    @property
    def secretKey(self) -> str:
        return self._secretKey

    @property
    def type(self) -> SystemType:
        return self._type

    @property
    def configServerIp(self) -> Optional[str]:
        return self._configServerIp

    @property
    def configServerPort(self) -> Optional[int]:
        return self._configServerPort

import configparser, os


from util.singleton import SingletonInstance


class SystemInfoMgr(SingletonInstance):

    def _on_init_once(self, config_dir=None):
        config_subdir = config_dir if config_dir else 'config'
        log_subdir = 'logs'
        src_subdir = 'src'

        self._baseDir = f'{os.path.dirname(os.path.abspath(__file__))}/..'
        self._configDir = f'{self._baseDir}/{config_subdir}'
        self._logDir = f'{self._baseDir}/{log_subdir}'
        self._srcDir = f'{self._baseDir}/{src_subdir}'
        config = configparser.ConfigParser()
        config.read(f'{self._configDir}/config.ini')

        self._project = config['project'].get('name', '')
        self._type = config['system'].get('type', '')
        self._agentId = config['system'].get('agent_id', '')
        self._secretKey = config['system'].get('secret_key', '')
        self._serverIp = config['server'].get('ip', '')
        self._serverPort = int(config['server'].get('port', '0'))
        self._logRetentionDay = int(config['log'].get('retention_day', '30'))

    def isServer(self) -> bool:
        return self._type == 'server'

    @property
    def project(self) -> str:
        return self._project

    @property
    def agentId(self) -> str:
        return self._agentId

    @property
    def secretKey(self) -> str:
        return self._secretKey

    @property
    def serverIp(self) -> str:
        return self._serverIp

    @property
    def serverPort(self) -> int:
        return self._serverPort

    @property
    def logRetentionDay(self) -> int:
        return self._logRetentionDay

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


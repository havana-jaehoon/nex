import json, configparser, os
from typing import Tuple, Optional, Dict

from util.singleton import SingletonInstance


class SystemInfoMgr(SingletonInstance):

    def _on_init_once(self):
        config_subdir = 'config'
        log_subdir = 'logs'
        src_subdir = 'src'

        self._base_dir = f'{os.path.dirname(os.path.abspath(__file__))}/..'
        self._config_dir = f'{self._base_dir}/{config_subdir}'
        self._log_dir = f'{self._base_dir}/{log_subdir}'
        self._src_dir = f'{self._base_dir}/{src_subdir}'
        config = configparser.ConfigParser()
        config.read(f'{self._config_dir}/config.ini')
        self._own_project_name = config['project'].get('name', None)
        self._own_system_name = config['system'].get('name', None)
        self._agent_id = config['system'].get('agent_id', None)
        self._secret_key = config['system'].get('secret_key', None)
        self._ip = config['system']['ip']
        self._port = int(config['system']['port'])
        self._log_retention_day = int(config['log']['retention_day'])

        self._routes: Dict[str, Tuple[str, int]] = {} # key: project_system, value: tuple(ip, port)
        with open(f'{self._config_dir}/route_table.json', 'r', encoding='utf-8') as f:
            route_info: dict = json.load(f)
            for project_name, system_list in route_info.items():
                for system_info in system_list:
                    system_name = system_info.get('system', None)
                    ip = system_info.get('ip', None)
                    port = system_info.get('port', None)
                    if system_name is None or ip is None or port is None:
                        pass
                    self._routes[f'{project_name}_{system_name}'] = (ip, port)

    @property
    def own_project_name(self) -> str:
        return self._own_project_name

    @own_project_name.setter
    def own_project_name(self, value: str):
        self._own_project_name = value

    @property
    def own_system_name(self) -> str:
        return self._own_system_name

    @own_system_name.setter
    def own_system_name(self, value: str):
        self._own_system_name = value

    @property
    def agent_id(self) -> str:
        return self._agent_id

    @property
    def secret_key(self) -> str:
        return self._secret_key

    @property
    def ip(self) -> str:
        return self._ip

    @property
    def port(self) -> int:
        return self._port

    @property
    def log_retention_day(self) -> int:
        return self._log_retention_day

    @property
    def base_dir(self) -> str:
        return self._base_dir

    @property
    def src_dir(self) -> str:
        return self._src_dir

    @property
    def log_dir(self) -> str:
        return self._log_dir

    @property
    def config_dir(self) -> str:
        return self._config_dir

    def get_route_info(self, project: str, system: str) -> Optional[Tuple[str, int]]:
        return self._routes.get(f'{project}_{system}', None)



if __name__ == '__main__':
    mgr = SystemInfoMgr()
    print(mgr.get_route_info('project1', 'system2'))
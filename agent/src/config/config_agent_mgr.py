from typing import Optional, Tuple, List

from config import url_def
from config.element_cfg import ElementCfgs
from config.system_cfg import SystemCfg
from config.config_base_mgr import ConfigBaseMgr
from auth.auth_agent import AuthAgent
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from util.pi_http.http_handler import Server_Dynamic_Handler


class ConfigAgentMgr(ConfigBaseMgr):

    def _on_init_once(self, cfg_name: str, **kwargs):
        super()._on_init_once(cfg_name=cfg_name, **kwargs)

        self._auth:AuthAgent = AuthAgent(SystemInfoMgr().config_dir)

    def _queryConfig(self) -> Optional[dict]:
        if not self._auth.isAuth:
            self._logger.log_error(f'ConfigClientMgr : queryConfig : fail : not auth status')
            return None
        else:
            return HttpReqMgr().get1Once(SystemInfoMgr().serverIp,
                                         SystemInfoMgr().serverPort,
                                         url_def.AGENT_CONFIG_QUERY_SUB_URL,
                                         {
                                             'project': self._auth.projectName,
                                             'system': self._auth.systemName
                                         })

    def _loadOwnConfig(self):
        try:
            self._logger.log_info(f'ConfigClientMgr : loadOwnConfig : start')

            # check update ????

            if self._elementCfgs.load() and self._systemCfg.load():
                self._logger.log_info(f'ConfigClientMgr : loadOwnConfig : load success')
            else:
                config_data = self._queryConfig()
                if not config_data or not isinstance(config_data, dict):
                    raise Exception('config query fail')
                all_systems = config_data.get('system', [])
                if not self._systemCfg.init(all_systems):
                    raise Exception('system-cfg loadAll fail')
                if not self._elementCfgs.init(config_data, self._systemCfg.getSystemConfig(self._auth.systemName), True):
                    raise Exception('element-cfgs loadAll fail')
                self._logger.log_info(f'ConfigClientMgr : loadOwnConfig : init success')
        except Exception as e:
            self._logger.log_error(f'ConfigClientMgr : loadOwnConfig : fail to {e}')
            raise Exception(f'ConfigClientMgr : loadOwnConfig fail to {e}')

    def start(self):
        self._logger.log_info(f'ConfigClientMgr : start')
        # start auth
        if self._auth.load():
            self._logger.log_info(f'ConfigClientMgr : auth-agent load success')
        else:
            if self._auth.init():
                self._logger.log_info(f'ConfigClientMgr : auth-agent init success')
            else:
                raise Exception('auth-agent init fail')

        self._systemCfg = SystemCfg(SystemInfoMgr().base_dir, self._cfgName)
        self._elementCfgs = ElementCfgs(self._auth.systemName, SystemInfoMgr().base_dir, self._cfgName)

        # start config
        self._loadOwnConfig()

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        pass
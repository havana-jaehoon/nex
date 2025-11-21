import asyncio, weakref
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Optional, Tuple, List

import url_def
from config.element_cfg import ElementCfgs
from config.system_cfg import SystemCfg
from config.config_base_mgr import ConfigBaseMgr
from auth.auth_agent import AuthAgent
from element.element_mgr import ElementMgr
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from util.pi_http.http_handler import Server_Dynamic_Handler, HandlerArgs, HandlerResult
from util.message_queue import MessageQueueWorker


class MessageType(Enum):
    CONFIG_UPDATE = auto()


@dataclass
class MessageQueueData:
    messageType: MessageType
    messageBody: dict = field(default_factory=dict)
    future: Optional[asyncio.Future] = None


class ConfigAgentMgr(ConfigBaseMgr):

    def _on_init_once(self, **kwargs):
        super()._on_init_once(**kwargs)
        self._auth:AuthAgent = AuthAgent(SystemInfoMgr().config_dir,
                                         SystemInfoMgr().src_dir,
                                         SystemInfoMgr().configServerIp,
                                         SystemInfoMgr().configServerPort,
                                         SystemInfoMgr().agentId,
                                         SystemInfoMgr().secretKey)
        self._serverIp = SystemInfoMgr().configServerIp
        self._serverPort = SystemInfoMgr().configServerPort
        self._messageQThread = MessageQueueWorker[MessageQueueData](self._messageQHandler)
        self._messageQThread.start()

    def _queryConfig(self) -> Optional[dict]:
        if not self._auth.isAuth:
            self._logger.log_error(f'ConfigClientMgr : queryConfig : fail : not auth status')
            return None
        else:
            return HttpReqMgr().getByAddress(self._serverIp,
                                             self._serverPort,
                                             url_def.AGENT_CONFIG_QUERY,
                                             {
                                             'project': self._auth.projectName,
                                             'system': self._auth.systemName
                                         })

    def _applyConfig(self, config_data: dict):
        all_systems = config_data.get('system', [])
        if not self._systemCfg.init(all_systems):
            raise Exception('system-cfg init fail')
        if not self._elementCfgs.init(config_data, self._systemCfg.getSystemConfig(self._auth.systemName), True):
            raise Exception('element-cfgs init fail')

    def _initOwnConfig(self):
        try:
            self._logger.log_info(f'ConfigClientMgr : initOwnConfig : start')
            if self._elementCfgs.load() and self._systemCfg.load():
                self._logger.log_info(f'ConfigClientMgr : initOwnConfig : load success')
            else:
                config_data = self._queryConfig()
                if not config_data or not isinstance(config_data, dict):
                    raise Exception('config query fail')
                self._applyConfig(config_data)
                self._logger.log_info(f'ConfigClientMgr : initOwnConfig : init success')
        except Exception as e:
            self._logger.log_error(f'ConfigClientMgr : initOwnConfig : fail to {e}')
            raise Exception(f'ConfigClientMgr : initOwnConfig fail to {e}')

    def _messageQHandler(self, msg: MessageQueueData):
        try:
            self._logger.log_info(f'ConfigAgentMgr : queue-Handler : start')
            self._logger.log_info(f'ConfigAgentMgr : queue-Handler : message ({msg})')

            if msg.messageType == MessageType.CONFIG_UPDATE:
                if not msg.messageBody or not isinstance(msg.messageBody, dict):
                    raise Exception('invalid body')
                self._applyConfig(msg.messageBody)
                ElementMgr().reloadElementCfgs(self._elementCfgs)
                if msg.future is not None:
                    loop = msg.future.get_loop()
                    result = HandlerResult(status=200, body='config update success')
                    loop.call_soon_threadsafe(msg.future.set_result, result)

            self._logger.log_info(f'ConfigAgentMgr : queue-Handler : success')
        except Exception as e:
            self._logger.log_error(f'ConfigAgentMgr : queue-Handler : exception : {e}')
            if msg.future is not None:
                loop = msg.future.get_loop()
                result = HandlerResult(status=500, body=f'exception : {e}')
                loop.call_soon_threadsafe(msg.future.set_result, result)

    async def _rcvReqConfigUpdate(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            self._logger.log_info(f'ConfigServerMgr : config update : start')

            loop = asyncio.get_running_loop()
            future: asyncio.Future = loop.create_future()

            self._messageQThread.put(
                MessageQueueData(
                    messageType=MessageType.CONFIG_UPDATE,
                    messageBody=handler_args.body,
                    future=future)
            )
            result: HandlerResult = await asyncio.wait_for(future, timeout=20.0)

            self._logger.log_info(f'ConfigServerMgr : config update : success')
            return result
        except asyncio.TimeoutError:
            self._logger.log_error('ConfigServerMgr : config update : timeout')
            return HandlerResult(status=504, body='timeout')
        except Exception as e:
            self._logger.log_error(f'ConfigServerMgr : config update ({handler_args, kwargs}) : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

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

        # start config
        self._systemCfg = SystemCfg(SystemInfoMgr().config_dir)
        self._elementCfgs = ElementCfgs(SystemInfoMgr().config_dir, self._auth.systemName)
        self._initOwnConfig()

    def stop(self):
        self._messageQThread.wait_until_done()
        self._messageQThread.stop()

    def getQueryHandlers(self) -> List[Tuple[str, Server_Dynamic_Handler, dict]]:
        handler_list: List[Tuple[str, Server_Dynamic_Handler, dict]] = [
            (url_def.AGENT_CONFIG_UPDATE,       self._rcvReqConfigUpdate,       {})
        ]
        handler_list.extend(self._auth.getQueryHandlers())
        return handler_list

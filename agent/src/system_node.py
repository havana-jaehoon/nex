import argparse
import time
import traceback
import faulthandler
import signal

from config.config_agent_mgr import ConfigAgentMgr
from config.config_server_mgr import ConfigServerMgr
from system_info import SystemInfoMgr, SystemType
from element.element_mgr import ElementMgr
# from command.cmd_mgr import CmdMgr
from command.admin_mgr import AdminMgr
from api.api_proc import HttpReqMgr
import mgr_registry
from util.pi_http.http_server import HttpServer
from util.log_util import Logger


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--agent-id', type=str, required=True, help='Agent ID')
    parser.add_argument('--secret-key', type=str, default=None, help='Agent Secret Key')
    parser.add_argument('--project', type=str, default=None, help='Project Name(only config-server)')
    parser.add_argument('--cfgServer-ip', type=str, default=None, help='Server IP(only agent)')
    parser.add_argument('--cfgServer-port', type=int, default=None, help='Server port(only agent)')
    parser.add_argument('--config-dir', type=str, default='', help='Configuration directory path')
    parser.add_argument('--data-dir', type=str, default='.config', help='Data directory path(only config-server)')
    args_dict = vars(parser.parse_args())

    # load system-info
    system_info = SystemInfoMgr(args_dict)

    # init logger
    logger = Logger(log_dir=system_info.log_dir, log_file_prefix=system_info.agentId, retention_day=30)

    admin_mgr = None
    # cmd_mgr = None
    config_mgr = None
    element_mgr = None
    http_server = None

    try:
        logger.log_info(f'==================== {system_info.agentId} start ====================')

        faulthandler.enable()
        #faulthandler.register(signal.SIGINT, all_threads=True, chain=True)

        HttpReqMgr()
        element_mgr = ElementMgr()
        mgr_registry.ELEMENT_MGR = element_mgr

        if system_info.type == SystemType.ADMIN:
            admin_mgr = AdminMgr()
            local_ip = '0.0.0.0'
            local_port = 9080
        else:
            if system_info.type == SystemType.CONFIG:
                config_mgr = ConfigServerMgr()
            else:
                config_mgr = ConfigAgentMgr()
            config_mgr.start()
            local_ip, local_port = config_mgr.getLocalAddress()
            for element_cfg in config_mgr.getElementConfigList():
                element_mgr.addElement(element_cfg)
            mgr_registry.CONFIG_MGR = config_mgr

        http_server = HttpServer(local_ip, local_port)
        mgr_registry.HTTP_SERVER = http_server
        http_server.add_dynamic_rules(element_mgr.getQueryHandlers())
        if admin_mgr:
            http_server.add_dynamic_rules(admin_mgr.get_query_handlers())
        if config_mgr:
            http_server.add_dynamic_rules(config_mgr.getQueryHandlers())

        element_mgr.start()
        http_server.start()

        # cmd_mgr = CmdMgr(element_mgr)
        # http_server.add_dynamic_rules(cmd_mgr.get_query_handlers())
        # cmd_mgr.start()

        while True:
            time.sleep(1)

    except (KeyboardInterrupt, SystemExit) as e:
        tb_str = traceback.format_exc()
        logger.log_info(f'==================== {system_info.agentId} stop : {e} : {tb_str} ====================')
        # if cmd_mgr: cmd_mgr.stop()
        if http_server: http_server.stop(5)
        if element_mgr: element_mgr.stop()
        if config_mgr: config_mgr.stop()
    except Exception as e:
        tb_str = traceback.format_exc()
        logger.log_error(f'==================== {system_info.agentId} stop : {e}: {tb_str} ====================')
        # if cmd_mgr: cmd_mgr.stop()
        if http_server: http_server.stop(5)
        if element_mgr: element_mgr.stop()
        if config_mgr: config_mgr.stop()

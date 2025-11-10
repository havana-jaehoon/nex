import argparse
import time
import traceback

from config.config_agent_mgr import ConfigAgentMgr
from config.config_server_mgr import ConfigServerMgr
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
# from command.cmd_mgr import CmdMgr
from command.admin_mgr import AdminMgr
from api.api_proc import HttpReqMgr
import mgr_registry
from util.pi_http.http_server import HttpServer
from util.log_util import Logger


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--config-dir', type=str, default=None, help='Configuration directory path')
    parser.add_argument('--data-dir', type=str, default=None, help='Data directory path')
    args = parser.parse_args()

    # load system-info
    config_name = args.config_dir if args.config_dir else 'config'
    data_name = args.data_dir if args.data_dir else 'data'

    system_info = SystemInfoMgr(config_dir=config_name)

    # init logger
    disp_name = system_info.agentId if system_info.agentId else 'server'
    logger = Logger(log_dir=system_info.log_dir,
                    log_file_prefix=disp_name,
                    retention_day=system_info.logRetentionDay)

    admin_mgr = None
    # cmd_mgr = None
    config_mgr = None
    element_mgr = None
    http_server = None

    try:
        logger.log_info(f'==================== {disp_name} start ====================')

        HttpReqMgr()

        if system_info.isServer():
            config_mgr = ConfigServerMgr(cfg_name=config_name, admin_cfg_name=data_name)
        else:
            config_mgr = ConfigAgentMgr(cfg_name=config_name)
        config_mgr.start()
        local_ip, local_port = config_mgr.getLocalAddress()

        element_mgr = ElementMgr(config_mgr=config_mgr)
        # cmd_mgr = CmdMgr(element_mgr)
        admin_mgr = AdminMgr()  # admin command manager

        mgr_registry.CONFIG_MGR = config_mgr
        mgr_registry.ELEMENT_MGR = element_mgr

        http_server = HttpServer(local_ip, local_port)
        http_server.add_dynamic_rules(element_mgr.getQueryHandlers())
        # http_server.add_dynamic_rules(cmd_mgr.get_query_handlers())
        http_server.add_dynamic_rules(admin_mgr.get_query_handlers())
        if system_info.isServer():
            http_server.add_dynamic_rules(config_mgr.getQueryHandlers())

        http_server.start()
        element_mgr.start()
        # cmd_mgr.start()

        while True:
            time.sleep(1)

    except (KeyboardInterrupt, SystemExit) as e:
        tb_str = traceback.format_exc()
        logger.log_info(f'==================== {disp_name} stop : {e} : {tb_str} ====================')
        # if cmd_mgr: cmd_mgr.stop()
        if element_mgr: element_mgr.stop()
        if http_server: http_server.stop(5)
    except Exception as e:
        tb_str = traceback.format_exc()
        logger.log_error(f'==================== {disp_name} stop : {e}: {tb_str} ====================')
        # if cmd_mgr: cmd_mgr.stop()
        if element_mgr: element_mgr.stop()
        if http_server: http_server.stop(5)

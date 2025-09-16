import time

from command.auth.auth_agent import AuthAgent
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from format.format_mgr import FormatMgr
from store.store_mgr import StoreMgr
from command.cmd_mgr import CmdMgr
from api.api_proc import ApiReq
from util.pi_http.http_server import HttpServer
from util.log_util import Logger



if __name__ == '__main__':

    # load system-info
    system_info = SystemInfoMgr()
    system_name = system_info.agent_id if system_info.agent_id else f'{system_info.own_project_name}_{system_info.own_system_name}'

    # init logger
    logger = Logger(log_dir=system_info.log_dir,
                    log_file_prefix= system_name,
                    retention_day=system_info.log_retention_day)

    element_mgr = None
    http_server = None
    try:
        # internal setup
        logger.log_info(f'==================== {system_name} start ====================')
        format_mgr = FormatMgr()
        store_mgr = StoreMgr(f"{system_info.config_dir}/config_storage.ini")
        element_mgr = ElementMgr()
        cmd_mgr = CmdMgr(element_mgr)

        # auth and provisioning (only for agent mode)
        if system_info.agent_id:
            AuthAgent.auth_req(system_info, ApiReq())

        # http setup
        http_server = HttpServer(system_info.ip, system_info.port)
        http_server.add_dynamic_rules(element_mgr.get_query_handlers())
        http_server.add_dynamic_rules(cmd_mgr.get_query_handlers())
        http_server.start()

        # element schedule start
        element_mgr.start()

        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit) as e:
        logger.log_info(f'==================== {system_name} stop : {e} ====================')
        if element_mgr: element_mgr.stop()
        if http_server: http_server.stop(5)

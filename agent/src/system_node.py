import time

from auth.system_auth import SystemAuth
from system_info import SystemInfoMgr
from element.element_mgr import ElementMgr
from format.format_mgr import FormatMgr
from store.store_mgr import StoreMgr
from api.api_proc import ApiReq
from util.pi_http.http_server import HttpServer
from util.log_util import Logger



if __name__ == '__main__':

    # load system-info
    system_info = SystemInfoMgr()

    # init logger
    logger = Logger(log_dir=system_info.log_dir, log_file_prefix=f'{system_info.own_project_name}_{system_info.own_system_name}', retention_day=system_info.log_retention_day)

    element_mgr = None
    http_server = None
    try:
        # internal setup
        logger.log_info(f'==================== {system_info.own_system_name} start ====================')
        format_mgr = FormatMgr()
        store_mgr = StoreMgr(f"{system_info.config_dir}/config_storage.ini")
        element_mgr = ElementMgr()

        # auth and provisioning (only for agent mode)
        if system_info.agent_id:
            SystemAuth.auth_req(system_info, ApiReq())

        # http setup
        http_server = HttpServer(system_info.ip, system_info.port)
        http_server.add_dynamic_rules(element_mgr.get_handler_list())
        http_server.start()

        # element schedule start
        element_mgr.start()

        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit) as e:
        logger.log_info(f'==================== {system_info.own_system_name} stop : {e} ====================')
        if element_mgr: element_mgr.stop()
        if http_server: http_server.stop(5)

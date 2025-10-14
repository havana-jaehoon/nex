
from command.cmd_process import *
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from jsonConfig.node_json import NodeJson
from util.log_util import Logger


class prov_client(CmdIntervalProcess):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self._install_path = kwargs['install_path']
        self._req_path = kwargs['req_path']
        self._cfg_server_project_name = kwargs['cfg_server_project_name']
        self._cfg_server_system_name = kwargs['cfg_server_system_name']
        Logger().log_info(f'provisioning(client) : start : install_path={self._install_path}')

    def process(self, inputs: List[Tuple[str, Optional[pd.DataFrame]]], *args, **kwargs) -> Optional[List[pd.DataFrame]]:
        system_mgr = SystemInfoMgr()
        body_data = HttpReqMgr().getReqOnce(self._cfg_server_project_name,
                                            self._cfg_server_system_name,
                                            self._req_path,
                                            {
                                                "agent_id" : system_mgr.agent_id
                                            })
        Logger().log_info(f'provisioning(client) : rcv data : {body_data}')
        if NodeJson.convert_all_json2file(body_data, self._install_path):
            Logger().log_info(f'provisioning(client) : install success : {self._install_path}')
        else:
            Logger().log_error(f'provisioning(client) : install fail : {self._install_path}')




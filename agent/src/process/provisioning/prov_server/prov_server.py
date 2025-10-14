
from command.cmd_process import *
from jsonConfig.node_json import NodeJson
from util.log_util import Logger


class prov_server(CmdProcess):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self._data_base_path = kwargs['data_base_path']
        Logger().log_info(f'provisioning(server) : start : data_base_path={self._data_base_path}')

    async def process(self,
                      handler_args: HandlerArgs,
                      inputs: List[Tuple[str, Optional[pd.DataFrame]]],
                      kwargs: dict) -> Tuple[HandlerResult, List[pd.DataFrame]]:
        agent_id = handler_args.query_params['agent_id']

        profile_df = inputs[0][1]
        system = profile_df[profile_df['agent_id'] == agent_id]['system'].values[0]
        if not system:
            return HandlerResult(status=400, body='system is not valid'), []

        access_df = inputs[1][1]
        if access_df[access_df['system'] == system].empty:
            return HandlerResult(status=400, body='access is not valid'), []

        system_config = NodeJson.convert_all_file2json(self._data_base_path, system)
        Logger().log_info(f'provisioning(server) : process : agent_id={agent_id}, system={system}, config={system_config}')
        return HandlerResult(status=200, body=system_config), []

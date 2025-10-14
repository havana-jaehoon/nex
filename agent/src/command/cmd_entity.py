import os
from apscheduler.schedulers.base import BaseScheduler
from typing import List, Tuple, Optional

from const_def import TimeUnit
from system_info import SystemInfoMgr
from command.cmd_cfg import CmdConfig
from command.cmd_process import CmdProcess, CmdIntervalProcess
from api.api_proc import InternalDataReqMgr
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, HandlerArgs, Server_Dynamic_Handler
from util.log_util import Logger


class CmdEntity:
    def __init__(self, folder_tree:List[str], cmd_cfg: dict, element_mgr: 'ElementMgr'):
        self._element_mgr = element_mgr
        self._cmd_cfg = CmdConfig(folder_tree, cmd_cfg)

        # create processor
        self._processor: Optional[CmdProcess] = None
        self._interval_processor: Optional[CmdIntervalProcess] = None
        processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{self._cmd_cfg.processor}',
                                            '',
                                            os.path.basename(self._cmd_cfg.processor),
                                            **self._cmd_cfg.processorKwargs)
        if processor:
            if isinstance(processor, CmdProcess):   self._processor = processor
            elif isinstance(processor, CmdIntervalProcess): self._interval_processor = processor
            else:   raise Exception(f"CmdEntity({self._cmd_cfg.id}) : processor is not valid")
        else:
            raise Exception(f"CmdEntity({self._cmd_cfg.id}) : processor is not valid")

    def __str__(self):
        return f'CmdEntity({self._cmd_cfg})'

    def _interval_proc(self):
        if not self._interval_processor:
            return
        try:
            # get input
            arg_list = None
            if self._cmd_cfg.inputs:
                df_list = InternalDataReqMgr.getReqMany(self._cmd_cfg.inputs, self._element_mgr.get_all_data)
                arg_list = [(element_id, df) for element_id, df in zip(self._cmd_cfg.inputs, df_list)]

            df_list = self._interval_processor.process(arg_list)
            if not df_list:
                return

            # set data to store
            if len(df_list) == len(self._cmd_cfg.outputs):
                for element_id, proc_df in zip(self._cmd_cfg.outputs, df_list):
                    if proc_df is None:
                        continue
                    self._element_mgr.set_data(element_id, proc_df)
        except Exception as e:
            Logger().log_error(f'CmdEntity({self._cmd_cfg.id}) : process error : {e}')


    async def _query_handler(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        try:
            # get input
            arg_list = None
            if self._cmd_cfg.inputs:
                df_list = InternalDataReqMgr.getReqMany(self._cmd_cfg.inputs, self._element_mgr.get_all_data)
                arg_list = [(element_id, df) for element_id, df in zip(self._cmd_cfg.inputs, df_list)]

            # execute processor
            handler_result, output_list = await self._processor.process(handler_args, arg_list, kwargs)

            # set data to store
            if handler_result.status == 200 and output_list and len(output_list) == len(self._cmd_cfg.outputs):
                for element_id, proc_df in zip(self._cmd_cfg.outputs, output_list):
                    if proc_df is None:
                        continue
                    self._element_mgr.set_data(element_id, proc_df)
            return handler_result
        except Exception as e:
            Logger().log_error(f'CmdEntity({self._cmd_cfg.id}) : process error : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    def get_id(self) -> str:
        return self._cmd_cfg.id if self._cmd_cfg else ''

    def get_query_handler(self) -> Tuple[Optional[Server_Dynamic_Handler], dict]:
        kwargs = {
            "element_mgr": self._element_mgr,
            "cmd_id": self._cmd_cfg.id
        }
        return self._query_handler if self._processor else None, kwargs

    def register_interval(self, scheduler: BaseScheduler):
        if not self._interval_processor:
            return

        if self._cmd_cfg.processingInterval and self._cmd_cfg.processingInterval > 0 and self._cmd_cfg.processingUnit:
            trigger_args = {}
            if self._cmd_cfg.processingUnit.upper() == TimeUnit.DAY.upper():
                trigger_args['days'] = self._cmd_cfg.processingInterval
            elif self._cmd_cfg.processingUnit.upper() == TimeUnit.HOUR.upper():
                trigger_args['hours'] = self._cmd_cfg.processingInterval
            elif self._cmd_cfg.processingUnit.upper() == TimeUnit.MINUTE.upper():
                trigger_args['minutes'] = self._cmd_cfg.processingInterval
            elif self._cmd_cfg.processingUnit.upper() == TimeUnit.SECOND.upper():
                trigger_args['seconds'] = self._cmd_cfg.processingInterval
            scheduler.add_job(self._interval_proc, 'interval', **trigger_args)

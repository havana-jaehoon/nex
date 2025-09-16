import os, re
import pandas as pd
from typing import List, Tuple
from apscheduler.schedulers.base import BaseScheduler

from const_def import TimeUnit
from system_info import SystemInfoMgr
from format.format_mgr import FormatMgr
from store.store_mgr import StoreMgr
from element.element_process import ElementProcess
from element.element_cfg import ElementConfig
from api.api_proc import ApiReq
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, BodyData, Server_Dynamic_Handler
from util.log_util import Logger


class ElementEntity:
    def __init__(self, folder_tree:List[str], element_cfg: dict, element_mgr: 'ElementMgr'):
        self._element_mgr = element_mgr
        self._element_cfg = ElementConfig(folder_tree, element_cfg)

        # print self
        print(self)
        # create new-scheme
        if folder_tree:
            cheme_name = f'{"_".join(folder_tree)}_{self._element_cfg.name}'.lower()
        else:
            cheme_name = self._element_cfg.name.lower()
        self._scheme = FormatMgr().get_scheme_instance(self._element_cfg.format, cheme_name)
        if not self._scheme:
            raise Exception(f"ElementEntity({self._element_cfg.id}) : format is not valid")
        try:
            self._apply_scheme()
        except Exception as e:
            raise Exception(f"ElementEntity({self._element_cfg.id}) : store is not valid : {e}")

        # create processor
        self._processor = None
        if self._element_cfg.processor:
            self._processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{self._element_cfg.processor}',
                                                      '',
                                                      os.path.basename(self._element_cfg.processor))
            if self._processor is None or not isinstance(self._processor, ElementProcess):
                raise Exception(f"ElementEntity({self._element_cfg.id}) : processor is not valid")

    def __str__(self):
        return f'ElementEntity({self._element_cfg})'

    def _interval_proc(self):
        if not self._processor:
            return
        try:
            # get source
            arg_list = []
            if self._element_cfg.sources:
                df_list = ApiReq().getReq(self._element_cfg.sources)
                arg_list = [(source, df) for source, df in zip(self._element_cfg.sources, df_list)]

            proc_df = self._processor.process(arg_list)
            if proc_df is None:
                return

            # set data to store
            self.set_data(proc_df)
        except Exception as e:
            Logger().log_error(f'ElementEntity({self._element_cfg.id}) : process error : {e}')

    async def _query_handler(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        if self._processor and self._processor.is_query_custom_handler:
            return await self._processor.query_custom_handler(exp, body, kwargs)
        else:
            # set columns and filter from exp later
            # ??????

            # get data from store
            get_own_data_func = kwargs.get("get_own_data_func")
            data_df = await get_own_data_func()
            return HandlerResult(status=200, body=data_df)

    def _apply_scheme(self):
        StoreMgr().apply_scheme(self._element_cfg.store, self._scheme)
        Logger().log_info(f'ElementEntity({self._element_cfg.id}) : {self._scheme.name} is created to {self._element_cfg.store}')

    def get_id(self) -> str:
        return self._element_cfg.id if self._element_cfg else ''

    def get_subUrl(self) -> str:
        return self._element_cfg.subUrl if self._element_cfg else ''

    def register_interval(self, scheduler: BaseScheduler):
        if self._element_cfg.processingInterval and self._element_cfg.processingInterval > 0 and self._element_cfg.processingUnit:
            trigger_args = {}
            if self._element_cfg.processingUnit.upper() == TimeUnit.DAY.upper():
                trigger_args['days'] = self._element_cfg.processingInterval
            elif self._element_cfg.processingUnit.upper() == TimeUnit.HOUR.upper():
                trigger_args['hours'] = self._element_cfg.processingInterval
            elif self._element_cfg.processingUnit.upper() == TimeUnit.MINUTE.upper():
                trigger_args['minutes'] = self._element_cfg.processingInterval
            elif self._element_cfg.processingUnit.upper() == TimeUnit.SECOND.upper():
                trigger_args['seconds'] = self._element_cfg.processingInterval
            scheduler.add_job(self._interval_proc, 'interval', **trigger_args)

    async def get_all_data(self) -> pd.DataFrame:
        return await StoreMgr().get_data_async(self._element_cfg.store, self._scheme.name)

    def set_data(self, data: pd.DataFrame):
        StoreMgr().set_data(self._element_cfg.store, self._scheme.name, data)

    def get_query_handler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        kwargs = {
            "element_mgr" : self._element_mgr,
            "get_own_data_func" : self.get_all_data
        }
        return self._query_handler, kwargs

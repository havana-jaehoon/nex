import os, re
from abc import ABC, abstractmethod

import pandas as pd
from typing import List, Tuple
from apscheduler.schedulers.base import BaseScheduler

from const_def import TimeUnit
from system_info import SystemInfoMgr
from format.format_mgr import FormatMgr
from store.store_mgr import StoreMgr
from base_process import ElementProcess, FuncElementProcess
from element.element_cfg import ElementConfig, FuncElementConfig
from api.api_proc import ApiReq, InternalReq
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, BodyData, Server_Dynamic_Handler
from util.log_util import Logger


class BaseElementEntity(ABC):
    def __init__(self, element_mgr: 'ElementMgr'):
        self._element_cfg = None
        self._element_mgr = element_mgr

    def get_id(self) -> str :
        return self._element_cfg.id if self._element_cfg else ''

    @staticmethod
    def get_element_type(element_cfg: dict) -> str:
        return element_cfg.get("type", '')

    @abstractmethod
    def __str__(self):
        pass

    @abstractmethod
    async def get_all_data(self) -> pd.DataFrame:
        pass

    @abstractmethod
    def set_data(self, data: pd.DataFrame):
        pass

    @abstractmethod
    def get_req_handler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        pass


class ElementEntity(BaseElementEntity):
    def __init__(self, folder_tree:List[str], element_cfg: dict, element_mgr: 'ElementMgr'):
        super().__init__(element_mgr)
        self._element_cfg = ElementConfig(folder_tree, element_cfg)

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

    async def _query_dft_handler(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        # set columns and filter from exp later
        # ??????

        # get data from store
        get_own_data_func = kwargs.get("get_own_data_func")
        data_df = await get_own_data_func()
        return HandlerResult(status=200, body=data_df)

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

    def _apply_scheme(self):
        StoreMgr().apply_scheme(self._element_cfg.store, self._scheme)
        Logger().log_info(f'ElementEntity({self._element_cfg.id}) : {self._scheme.name} is created to {self._element_cfg.store}')

    async def get_all_data(self) -> pd.DataFrame:
        return await StoreMgr().get_data_async(self._element_cfg.store, self._scheme.name)

    def set_data(self, data: pd.DataFrame):
        StoreMgr().set_data(self._element_cfg.store, self._scheme.name, data)

    def get_req_handler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        kwargs = {
            "get_own_data_func" : self.get_all_data
        }
        if self._processor and self._processor.is_query_custom_handler:
            return self._processor.query_custom_handler, kwargs
        else:
            return self._query_dft_handler, kwargs


class FuncElementEntity(BaseElementEntity):
    def __init__(self, folder_tree:List[str], element_cfg: dict, element_mgr: 'ElementMgr'):
        super().__init__(element_mgr)
        self._element_cfg = FuncElementConfig(folder_tree, element_cfg)

        # create processor
        self._processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{self._element_cfg.processor}',
                                                  '',
                                                  os.path.basename(self._element_cfg.processor))
        if self._processor is None or not isinstance(self._processor, FuncElementProcess):
            raise Exception(f"FuncElementEntity({self._element_cfg.id}) : processor is not valid")

    def __str__(self):
        return f'FuncElementEntity({self._element_cfg})'

    async def _proc(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        try:
            # get input
            arg_list = None
            if self._element_cfg.inputs:
                df_list = InternalReq.getReq(self._element_cfg.inputs, self._element_mgr.get_all_data)
                arg_list = [(element_id, df) for element_id, df in zip(self._element_cfg.inputs, df_list)]

            handler_result, output_list = await self._processor.process(exp, body, arg_list, kwargs)

            # set data to store
            for element_id, proc_df in zip(self._element_cfg.outputs, output_list):
                if proc_df is None:
                    continue
                self._element_mgr.set_data(element_id, proc_df)
            return handler_result
        except Exception as e:
            Logger().log_error(f'FuncElementEntity({self._element_cfg.id}) : process error : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    async def get_all_data(self) -> pd.DataFrame:
        return pd.DataFrame()

    def set_data(self, data: pd.DataFrame):
        pass

    def get_req_handler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        return self._proc, {}

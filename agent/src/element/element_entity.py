import os, re
import pandas as pd
from typing import List, Callable, Tuple
from apscheduler.schedulers.base import BaseScheduler

from const_def import TimeUnit
from system_info import SystemInfoMgr
from process.base_process import BaseProcess
from format.format_mgr import FormatMgr
from store.store_mgr import StoreMgr
from element.element_cfg import ElementConfig
from api.api_proc import ApiReq
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, BodyData
from util.log_util import Logger


class ElementEntity:
    def __init__(self, folder_tree:List[str], element_cfg: dict):
        self._element_cfg = ElementConfig(folder_tree, element_cfg)
        # self._data_lock = threading.Lock()

        self._scheme = None
        # create new-scheme
        if self._element_cfg.format:
            cheme_name = f'{"_".join(folder_tree)}_{self._element_cfg.name}'.lower()
            self._scheme = FormatMgr().get_scheme_instance(self._element_cfg.format, cheme_name)
            if not self._scheme:
                raise Exception(f"ElementEntity({self._element_cfg.id}) : format is not valid")
            try:
                StoreMgr().apply_scheme(self._element_cfg.store, self._scheme)
                Logger().log_info(f'ElementEntity({self._element_cfg.id}) : {self._scheme.name} is created to {self._element_cfg.store}')
            except Exception as e:
                raise Exception(f"ElementEntity({self._element_cfg.id}) : store is not valid : {e}")

        # init processor
        self._processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{self._element_cfg.processor}',
                                                  '',
                                                  os.path.basename(self._element_cfg.processor))
        if self._processor is None or not isinstance(self._processor, BaseProcess):
            raise Exception(f"ElementEntity({self._element_cfg.id}) : processor is not valid")

    def __str__(self):
        return f'ElementEntity({self._element_cfg})'

    def _interval_proc(self):
        if not self._processor:
            return

        try:
            # source info
            sources = None
            df_list = None
            if self._element_cfg.sources:
                sources = self._element_cfg.sources.split(',')
                if sources:
                    df_list = ApiReq().getReq(sources)

            proc_df = self._processor.process(sources, df_list)
            if proc_df is None:
                return

            # save data to store
            if self._scheme:
                StoreMgr().set_data(self._element_cfg.store, self._scheme.name, proc_df)
        except Exception as e:
            Logger().log_error(f'ElementEntity({self._element_cfg.id}) : process error : {e}')

    async def _get_all_data(self) -> pd.DataFrame:
        if self._scheme:
            # get data from store
            return await StoreMgr().get_data_async(self._element_cfg.store, self._scheme.name)
        else:
            return pd.DataFrame()

    @staticmethod
    async def _req_default_handler(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        # set columns and filter from exp later
        # ??????

        # get data from store
        get_data_func = kwargs.get("get_data_func")
        data_df = await get_data_func()
        return HandlerResult(status=200, body=data_df)

    def register_interval(self, scheduler: BaseScheduler):
        if self._element_cfg.processingInterval > 0:
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

    def get_id(self) -> str :
        return self._element_cfg.id

    def get_req_handler(self) -> Tuple[Callable, dict]:
        kwargs = {
            "get_data_func" : self._get_all_data
        }
        if self._processor and self._processor.is_req_custom_handler:
            return self._processor.req_custom_handler, kwargs
        else:
            return self._req_default_handler, kwargs

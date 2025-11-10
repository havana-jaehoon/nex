import os
import pandas as pd
from typing import Tuple, Optional, Dict, Any
from apscheduler.schedulers.base import BaseScheduler

from const_def import TimeUnit
from store.storage_api import StorageApi
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from config.element_cfg import ElementCfg
from format.format_api import FormatApi
from element.element_process import ElementProcess
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, HandlerArgs, Server_Dynamic_Handler
from util.log_util import Logger


class ElementEntity:
    def __init__(self, element_cfg: ElementCfg):
        self._config = element_cfg.clone()

        # create new-scheme
        if self._config.parentList:
            scheme_name = f'{"_".join(self._config.parentList)}_{self._config.name}'.lower()
        else:
            scheme_name = self._config.name.lower()
        self._scheme = FormatApi.createSchemeInstance(self._config.getConfig('format'), scheme_name)
        if not self._scheme:
            raise Exception(f"ElementEntity({self._config.id}) : format is not valid")

        # create storage and appy scheme
        try:
            storage_config = self._config.getConfig('storage')
            self._storage = StorageApi.createStorageInstance(storage_config)
            self._storage.applySchema(self._scheme)
            Logger().log_info(f'ElementEntity({self._config.id}) : {self._scheme.name} is created to {self._storage.name()}')
        except Exception as e:
            self._storage = None
            Logger().log_error(f"ElementEntity({self._config.id}) : store is not valid : {e}")

        # create processor
        self._processor: Optional[ElementProcess] = None
        processor_name = self._config.getConfig('element').get('processor')
        if processor_name:
            self._processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{processor_name}',
                                                      '',
                                                      os.path.basename(processor_name))
            if self._processor is None or not isinstance(self._processor, ElementProcess):
                raise Exception(f"ElementEntity({self._config.id}) : processor is not valid")

    def __str__(self):
        return f'ElementEntity({self._config})'

    @property
    def id(self) -> str:
        return self._config.id if self._config else ''

    def _interval_proc(self):
        if not self._processor:
            return
        try:
            # get source
            arg_list = []
            source_list = self._config.getConfig('element').get('sources')
            if source_list:
                source_list = [ (source, None) for source in source_list ]
                df_list = HttpReqMgr().getMany(source_list)
                arg_list = [(source, df) if isinstance(df, pd.DataFrame) else (source, pd.DataFrame()) for source, df in zip(source_list, df_list)]

            # execute processor
            proc_df = self._processor.process(arg_list)
            if proc_df is None:
                return

            # set data to store
            self.setData(proc_df)
        except Exception as e:
            import traceback
            tb_str = traceback.format_exc()
            Logger().log_error(f'ElementEntity({self._config.id}) : process error : {tb_str}')

    async def _queryHandler(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        if self._processor and self._processor.is_query_custom_handler:
            return await self._processor.query_custom_handler(handler_args, kwargs)
        else:
            # set columns and filter from exp later
            # ??????

            # get data of element
            data_df = await self.getData()
            return HandlerResult(status=200, body=data_df)

    def register_interval(self, scheduler: BaseScheduler):
        processing_interval = self._config.getConfig('element').get('processingInterval', '0')
        processing_interval = int(processing_interval) if processing_interval else 0
        processing_unit = self._config.getConfig('element').get('processingUnit', 'MIN')
        processing_unit = processing_unit if processing_unit else 'MIN'
        if processing_interval and processing_interval > 0 and processing_unit:
            trigger_args = {}
            if processing_unit.upper() == TimeUnit.DAY.upper():
                trigger_args['days'] = processing_interval
            elif processing_unit.upper() == TimeUnit.HOUR.upper():
                trigger_args['hours'] = processing_interval
            elif processing_unit.upper() == TimeUnit.MINUTE.upper():
                trigger_args['minutes'] = processing_interval
            elif processing_unit.upper() == TimeUnit.SECOND.upper():
                trigger_args['seconds'] = processing_interval
            scheduler.add_job(self._interval_proc, 'interval', **trigger_args)

    async def getData(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        if self._storage:
            return await self._storage.getDataAsync(self._scheme.name, filters)
        else:
            return pd.DataFrame()

    def setData(self, data: pd.DataFrame):
        if self._storage:
            chunk_size = self._config.getConfig('store').get('record').get('chunkSize')
            allowed_upsert = self._config.getConfig('store').get('record').get('allowUpsert')
            self._storage.setData(self._scheme.name, data, chunk_size, allowed_upsert)

    def getQueryHandler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        kwargs = {}
        return self._queryHandler, kwargs

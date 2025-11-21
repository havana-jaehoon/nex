import os
import pandas as pd
from typing import Tuple, Optional, Dict, Any, List
from apscheduler.schedulers.base import BaseScheduler
from readerwriterlock import rwlock

from const_def import TimeUnit
from store.storage import Storage
from store.storage_api import StorageApi
from system_info import SystemInfoMgr
from api.api_proc import HttpReqMgr
from config.element_cfg import ElementCfg
from format.scheme_parser import SchemaParser
from element.element_process import ElementProcess
from util.dict_util import DictUtil
from util.module_loader import ModuleLoader
from util.pi_http.http_handler import HandlerResult, HandlerArgs, Server_Dynamic_Handler
from util.scheme_define import SchemaDefinition
from util.log_util import Logger


class ElementEntity:

    def __init__(self, element_cfg: ElementCfg, scheduler: BaseScheduler):
        self._config:Optional[ElementCfg] = None
        self._storage: Optional[Storage] = None
        self._scheme: Optional[SchemaDefinition] = None
        self._processor: Optional[ElementProcess] = None
        self._configRWLock = rwlock.RWLockFairD()
        self._configRLock = self._configRWLock.gen_rlock()
        self._configWLock = self._configRWLock.gen_wlock()
        self._schedulerJob = None

        self.applyConfig(element_cfg, scheduler)

    def __str__(self):
        with self._configRLock:
            return f'ElementEntity({self._config})'

    # scheduler-job handler
    def _interval_proc(self):
        with self._configRLock:
            if not self._processor:
                return
            try:
                # get source
                arg_list = []
                source_list = self._config.getConfig('element').get('sources')
                if source_list:
                    source_list = [ (source, None) for source in source_list ]
                    Logger().log_info(f"ElementEntity({self._config.id}) : query source : {source_list}")
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

    # element-query handler
    async def _queryHandler(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        with self._configRLock:
            if self._processor and self._processor.is_query_custom_handler:
                return await self._processor.query_custom_handler(handler_args, kwargs)
            else:
                # set columns and filter from exp later
                # ??????

                if handler_args.method == 'GET':
                    data_df = await self.getDataAsync()
                    return HandlerResult(status=200, body=data_df)
                else:
                    return HandlerResult(status=405, body='Method Not Allowed, use GET')

    def _reset(self):
        self._config = None
        self._storage = None
        self._scheme = None
        self._processor = None
        if self._schedulerJob:
            self._schedulerJob.remove()
            self._schedulerJob = None

    def _applyStorage(self):
        try:
            storage_config = self._config.getConfig('storage')
            self._storage = StorageApi.createStorageInstance(storage_config)
            if not self._storage:
                raise Exception(f"storage is not valid")
            self._scheme = SchemaParser.createSchemeInstance(self._config.parentList, self._config.name,
                                                             self._config.getConfig('format'))
            if not self._scheme:
                raise Exception(f"scheme is not valid")
            self._storage.applySchema(self._scheme)
            Logger().log_info(f'ElementEntity({self._config.id}) : {self._scheme.name} is created to {self._storage.name()}')
        except Exception as e:
            self._scheme = None
            self._storage = None
            Logger().log_error(f"ElementEntity({self._config.id}) : fail to create storage/schema : {e}")

    def _applyProcessor(self):
        processor_name = self._config.getConfig('element').get('processor')
        if processor_name:
            self._processor = ModuleLoader.loadModule(f'{SystemInfoMgr().src_dir}/process/{processor_name}',
                                                      '',
                                                      os.path.basename(processor_name))
            if self._processor is None or not isinstance(self._processor, ElementProcess):
                raise Exception(f"ElementEntity({self._config.id}) : processor is not valid")

    def _registerInterval(self, scheduler: BaseScheduler):
        if self._config and not self._schedulerJob:
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
                self._schedulerJob = scheduler.add_job(self._interval_proc, 'interval', **trigger_args)

    def stop(self):
        with self._configRLock:
            self._reset()

    def getDataSync(self, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        with self._configRLock:
            if self._storage:
                return self._storage.getData(self._scheme.name, filters, columns)
            else:
                return pd.DataFrame()

    async def getDataAsync(self, filters: Optional[Dict[str, Any]] = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        with self._configRLock:
            if self._storage:
                return await self._storage.getDataAsync(self._scheme.name, filters, columns)
            else:
                return pd.DataFrame()

    def setData(self, data: pd.DataFrame):
        with self._configRLock:
            if self._storage:
                chunk_size = self._config.getConfig('store').get('record').get('chunkSize', 1000)
                allowed_upsert = self._config.getConfig('store').get('record').get('allowUpsert', True)
                self._storage.setData(self._scheme.name, data, chunk_size, allowed_upsert)

    def applyConfig(self, element_cfg: ElementCfg, scheduler: BaseScheduler):
        with self._configWLock:
            if DictUtil.deep_equal_ignore_order(self._config, element_cfg):
                Logger().log_info(f'Element is not applied (config same) : {self._config.id}')
                return
            else:
                self._reset()
                self._config = element_cfg.clone()
                # create storage and appy scheme
                self._applyStorage()
                # create processor
                self._applyProcessor()
                # register scheduler job
                self._registerInterval(scheduler)
                Logger().log_info(f'Element is applied : {self._config.id}')

    @property
    def id(self) -> str:
        with self._configRLock:
            return self._config.id

    @property
    def url(self) -> str:
        with self._configRLock:
            return self._config.url

    def getQueryHandler(self) -> Tuple[Server_Dynamic_Handler, dict]:
        kwargs = {}
        return self._queryHandler, kwargs

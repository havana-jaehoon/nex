import asyncio
import concurrent.futures
import json, io
import pandas as pd
from typing import List, Tuple, Callable, Awaitable, Any, Optional

from system_info import SystemInfoMgr
from util.singleton import SingletonInstance
from util.pi_http.http_client import HttpClient
from util.pi_http.http_util import HttpUtil
from util.async_util import NewLoop
from util.log_util import Logger


class HttpReqMgr(SingletonInstance):

    REQ_TIME_OUT = 10

    def _on_init_once(self):
        self._http_client = HttpClient()

    @staticmethod
    def _manipulate_source_id(source_id: str, **kwargs) -> str:
        param_str = ''
        for i, param in enumerate(kwargs.items()):
            if i == 0:
                param_str += f'?{param[0]}={param[1]}'
            else:
                param_str += f'&{param[0]}={param[1]}'
        source_id = f'{source_id}{param_str}'
        return source_id

    @staticmethod
    def _proc_body(status_code: int, content_type: str, body_data: bytes) -> Optional[Any]:
        data = None
        media_type, charset = HttpUtil.parse_content_type_header(content_type)
        if status_code == 200 and body_data:
            if media_type == "application/json":
                body_str = body_data.decode(charset, errors='ignore')
                data = json.loads(body_str)
            elif media_type == "text/csv":
                body_str = body_data.decode(charset, errors='ignore')
                data = pd.read_csv(io.StringIO(body_str))
        return data

    @staticmethod
    def get_url(project_name: str, system_name: str, source_id: str, **kwargs) -> str:
        new_source_id = HttpReqMgr._manipulate_source_id(source_id, **kwargs)
        if not project_name:
            project_name = SystemInfoMgr().own_project_name
        if not system_name or not new_source_id:
            return ""
        route_info = SystemInfoMgr().get_route_info(project_name, system_name)
        if not route_info:
            return ""
        return f"http://{route_info[0]}:{route_info[1]}{new_source_id}"

    def getReqSyncResult1(self, project_name: str, system_name: str, source_id: str, source_param: dict=None) -> Tuple[str, concurrent.futures.Future]:
        if source_param is None:
            source_param = {}
        url = HttpReqMgr.get_url(project_name, system_name, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req {system_name}:{source_id} => {url}")
        return url, self._http_client.get_async_sync_result(url, HttpReqMgr.REQ_TIME_OUT)

    def getReqSyncResult(self, source: str, source_param: dict=None) -> Tuple[str, concurrent.futures.Future]:
        if source_param is None:
            source_param = {}
        project_name, system_name, source_id = source.split(':', 2)
        url = HttpReqMgr.get_url(project_name, system_name, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req {system_name}:{source_id} => {url}")
        return url, self._http_client.get_async_sync_result(url, HttpReqMgr.REQ_TIME_OUT)

    def getReqAsyncResult(self, source: str, source_param: dict=None, result_loop: Optional[asyncio.AbstractEventLoop]=None) -> Tuple[str, asyncio.Future]:
        if source_param is None:
            source_param = {}
        project_name, system_name, source_id = source.split(':', 2)
        url = HttpReqMgr.get_url(project_name, system_name, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req {system_name}:{source_id} => {url}")
        return url, self._http_client.get_async(url, HttpReqMgr.REQ_TIME_OUT, result_loop)

    def getReqOnce(self, project_name: str, system_name: str, source_id: str, source_param: dict=None) -> Optional[Any]:
        url, fut = self.getReqSyncResult1(project_name, system_name, source_id, source_param)
        try:
            status_code, content_type, body_data = fut.result()
            Logger().log_info(f"HttpReq : Get-Rsp {status_code}:{len(body_data)} <= {url}")
            data = HttpReqMgr._proc_body(status_code, content_type, body_data)
            return data
        except Exception as e:
            Logger().log_error(f"HttpReq : Get {url} exception : {e}")
            return None

    def getReqMany(self, source_list: List[Tuple[str, Optional[dict]]]) -> List[Any]:
        indexed_futures = []
        for idx, source_tuple in enumerate(source_list):
            url, fut = self.getReqSyncResult(source_tuple[0], source_tuple[1])
            indexed_futures.append((idx, fut, url))

        results: List[Any] = [None] * len(source_list)
        for idx, fut, url in indexed_futures:
            try:
                status_code, content_type, body_data = fut.result()
                Logger().log_info(f"HttpReq : Get-Rsp {status_code}:{len(body_data)} <= {url}")
                data = HttpReqMgr._proc_body(status_code, content_type, body_data)
                results[idx] = data
            except Exception as e:
                Logger().log_error(f"HttpReq : Get {url} exception : {e}")
                results[idx] = None
        return results

    def postReqOnce(self, source: str, data: dict, source_param: Optional[dict]=None) -> Tuple[int, str]:
        if source_param is None:
            source_param = {}
        project_name, system_name, source_id = source.split(':', 2)
        url = HttpReqMgr.get_url(project_name, system_name, source_id, **source_param)
        Logger().log_info(f"HttpClient : Post-Req {system_name}:{source_id} => {url}")
        fut = self._http_client.post_async_sync_result(url, data)
        try:
            status_code, body_str = fut.result()
            return status_code, body_str
        except Exception as e:
            Logger().log_error(f"HttpReq : Post {url} exception : {e}")
            return 500, str(e)


class InternalDataReqMgr:

    @staticmethod
    def getReqSyncResult(source: str,
                         func: Callable[[str], Awaitable[pd.DataFrame]],
                         loop: NewLoop) -> concurrent.futures.Future:
        return loop.run_async_sync_result(func(source))

    @staticmethod
    def getReqAsyncResult(source: str,
                          func: Callable[[str], Awaitable[pd.DataFrame]],
                          loop: NewLoop,
                          result_loop: Optional[asyncio.AbstractEventLoop]=None) -> asyncio.Future:
        return loop.run_async(func(source), result_loop)

    @staticmethod
    def getReqMany(source_list: List[str], func: Callable[[str], Awaitable[pd.DataFrame]]) -> List[pd.DataFrame]:
        new_loop = NewLoop()
        indexed_futures = []
        for idx, source in enumerate(source_list):
            fut = InternalDataReqMgr.getReqSyncResult(source, func, new_loop)
            indexed_futures.append((idx, fut, source))

        results: List[pd.DataFrame] = [pd.DataFrame()] * len(source_list)
        for idx, fut, source in indexed_futures:
            try:
                results[idx] = fut.result()
            except Exception as e:
                Logger().log_error(f"InternalDataReq : getReq({source}) exception : {e}")
                results[idx] = pd.DataFrame()
        new_loop.stop()
        return results

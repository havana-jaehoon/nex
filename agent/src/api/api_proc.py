import asyncio
import concurrent.futures
import json, io
import pandas as pd
from typing import List, Tuple, Callable, Awaitable, Any, Optional

import mgr_registry
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
    def _setSourceIdParam(source_id: str, **kwargs) -> str:
        param_str = ''
        for i, param in enumerate(kwargs.items()):
            if i == 0:
                param_str += f'?{param[0]}={param[1]}'
            else:
                param_str += f'&{param[0]}={param[1]}'
        source_id = f'{source_id}{param_str}'
        return source_id

    @staticmethod
    def _readBody(status_code: int, content_type: str, body_data: bytes) -> Optional[Any]:
        media_type, charset = HttpUtil.parse_content_type_header(content_type)
        if status_code == 200 and body_data:
            if media_type == "application/json":
                body_str = body_data.decode(charset, errors='ignore')
                return json.loads(body_str)
            elif media_type == "text/csv":
                body_str = body_data.decode(charset, errors='ignore')
                return pd.read_csv(io.StringIO(body_str))
            elif media_type == "text/plain":
                return body_data.decode(charset, errors='ignore')
        return None

    @staticmethod
    def _getUrl1(target_system_name: str, source_id: str, **kwargs) -> str:
        new_source_id = HttpReqMgr._setSourceIdParam(source_id, **kwargs)
        if not target_system_name or not new_source_id:
            return ""
        system_address = mgr_registry.CONFIG_MGR.getSystemAddress(target_system_name)
        if not system_address:
            return ""
        return f"http://{system_address[0]}:{system_address[1]}{new_source_id}"

    @staticmethod
    def _getUrl2(target_ip: str, target_port: int, source_id: str, **kwargs) -> str:
        new_source_id = HttpReqMgr._setSourceIdParam(source_id, **kwargs)
        if not target_ip or not new_source_id:
            return ""
        return f"http://{target_ip}:{target_port}{new_source_id}"

    def _sendGet1SyncResult(self, target_ip: str, target_port: int, source_id: str, source_param: dict=None) \
            -> Tuple[str, concurrent.futures.Future]:
        if source_param is None:
            source_param = {}
        url = HttpReqMgr._getUrl2(target_ip, target_port, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req : {source_id} : {url}")
        return url, self._http_client.get_async_sync_result(url, HttpReqMgr.REQ_TIME_OUT)

    def _sendGet2SyncResult(self, source: str, source_param: dict=None) \
            -> Tuple[str, concurrent.futures.Future]:
        if source_param is None:
            source_param = {}
        system_name, source_id = source.split(':', 1)
        url = HttpReqMgr._getUrl1(system_name, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req : {system_name}, {source_id} : {url}")
        return url, self._http_client.get_async_sync_result(url, HttpReqMgr.REQ_TIME_OUT)

    def _sendGet1AsyncResult(self, target_ip: str, target_port: int, source_id: str, source_param: dict=None, result_loop: Optional[asyncio.AbstractEventLoop]=None) \
            -> Tuple[str, asyncio.Future]:
        if source_param is None:
            source_param = {}
        url = HttpReqMgr._getUrl2(target_ip, target_port, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req : {source_id} : {url}")
        return url, self._http_client.get_async(url, HttpReqMgr.REQ_TIME_OUT, result_loop)

    def _sendGet2AsyncResult(self, source: str, source_param: dict=None, result_loop: Optional[asyncio.AbstractEventLoop]=None) \
            -> Tuple[str, asyncio.Future]:
        if source_param is None:
            source_param = {}
        system_name, source_id = source.split(':', 1)
        url = HttpReqMgr._getUrl1(system_name, source_id, **source_param)
        Logger().log_info(f"HttpReq : Get-Req : {system_name}, {source_id} : {url}")
        return url, self._http_client.get_async(url, HttpReqMgr.REQ_TIME_OUT, result_loop)

    def get1Once(self, target_ip: str, target_port: int, source_id: str, source_param: dict=None) -> Optional[Any]:
        url, fut = self._sendGet1SyncResult(target_ip, target_port, source_id, source_param)
        try:
            status_code, content_type, body_data = fut.result()
            if status_code != 200:
                Logger().log_error(f"HttpReq : Get-Rsp : {status_code}, {body_data} <= {url}")
            else:
                Logger().log_info(f"HttpReq : Get-Rsp : {status_code} <= {url}")
            data = HttpReqMgr._readBody(status_code, content_type, body_data)
            return data
        except Exception as e:
            Logger().log_error(f"HttpReq : Get : {url} exception : {e}")
            return None

    def get2Once(self, source: str, source_param: dict=None) -> Optional[Any]:
        url, fut = self._sendGet2SyncResult(source, source_param)
        try:
            status_code, content_type, body_data = fut.result()
            if status_code != 200:
                Logger().log_error(f"HttpReq : Get-Rsp : {status_code}, {body_data} <= {url}")
            else:
                Logger().log_info(f"HttpReq : Get-Rsp : {status_code} <= {url}")
            data = HttpReqMgr._readBody(status_code, content_type, body_data)
            return data
        except Exception as e:
            Logger().log_error(f"HttpReq : Get : {url} exception : {e}")
            return None

    def getMany(self, source_list: List[Tuple[str, Optional[dict]]]) -> List[Any]:
        indexed_futures = []
        for idx, source_tuple in enumerate(source_list):
            url, fut = self._sendGet2SyncResult(source_tuple[0], source_tuple[1])
            indexed_futures.append((idx, fut, url))

        results: List[Any] = [None] * len(source_list)
        for idx, fut, url in indexed_futures:
            try:
                status_code, content_type, body_data = fut.result()
                if status_code != 200:
                    Logger().log_error(f"HttpReq : Get-Rsp : {status_code}, {body_data} <= {url}")
                else:
                    Logger().log_info(f"HttpReq : Get-Rsp : {status_code} <= {url}")
                data = HttpReqMgr._readBody(status_code, content_type, body_data)
                results[idx] = data
            except Exception as e:
                Logger().log_error(f"HttpReq : Get : {url} exception : {e}")
                results[idx] = None
        return results

    def post1Once(self, target_ip: str, target_port: int, source_id: str, data: dict, source_param: Optional[dict]=None) -> Tuple[int, str]:
        if source_param is None:
            source_param = {}
        url = HttpReqMgr._getUrl2(target_ip, target_port, source_id, **source_param)
        Logger().log_info(f"HttpClient : Post-Req : {source_id} => {url}")
        fut = self._http_client.post_async_sync_result(url, data)
        try:
            status_code, body_str = fut.result()
            Logger().log_info(f"HttpReq : Post-Rsp : {status_code}, {body_str} <= {url}")
            return status_code, body_str
        except Exception as e:
            Logger().log_error(f"HttpReq : Post : {url} exception : {e}")
            return 500, str(e)

    def post2Once(self, source: str, data: dict, source_param: Optional[dict]=None) -> Tuple[int, str]:
        if source_param is None:
            source_param = {}
        system_name, source_id = source.split(':', 1)
        url = HttpReqMgr._getUrl1(system_name, source_id, **source_param)
        Logger().log_info(f"HttpClient : Post-Req : {system_name}, {source_id} => {url}")
        fut = self._http_client.post_async_sync_result(url, data)
        try:
            status_code, body_str = fut.result()
            Logger().log_info(f"HttpReq : Post-Rsp : {status_code}, {body_str} <= {url}")
            return status_code, body_str
        except Exception as e:
            Logger().log_error(f"HttpReq : Post : {url} exception : {e}")
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

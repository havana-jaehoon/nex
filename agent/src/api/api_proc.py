import json, io
import pandas as pd
from typing import List, Tuple

from system_info import SystemInfoMgr
from util.singleton import SingletonInstance
from util.pi_http.http_client import HttpClient
from util.pi_http.http_util import HttpUtil
from util.log_util import Logger


class ApiReq(SingletonInstance):

    def _on_init_once(self, url_prefix: str = ""):
        self._logger = Logger()
        self._http_client = HttpClient()

    @staticmethod
    def _manipulate_source_id(source_id: str) -> str:
        # condition, selection ?????
        return source_id

    @staticmethod
    def _get_url(project_name: str, system_name: str, source_id: str, url_prefix: str="") -> str:
        new_source_id = ApiReq._manipulate_source_id(source_id)
        if not project_name:
            project_name = SystemInfoMgr().own_project_name
        if not system_name or not new_source_id:
            return ""
        route_info = SystemInfoMgr().get_route_info(project_name, system_name)
        if not route_info:
            return ""
        return f"http://{route_info[0]}:{route_info[1]}{url_prefix}{new_source_id}"

    def getReq(self, source_list: List[str]) -> List[pd.DataFrame]:
        indexed_futures = []
        for idx, source in enumerate(source_list):
            project_name, system_name, source_id = source.split(':', 2)
            url = ApiReq._get_url(project_name, system_name, source_id)
            Logger().log_info(f"HttpClient : getReq({url}) => {system_name}:{source_id}")
            fut = self._http_client.get_async_sync_result(url)
            indexed_futures.append((idx, fut, url))

        results: List[pd.DataFrame] = [pd.DataFrame()] * len(source_list)
        for idx, fut, url in indexed_futures:
            try:
                status_code, content_type, body_data = fut.result()
                media_type, charset = HttpUtil.parse_content_type_header(content_type)
                Logger().log_info(f"HttpClient : getReq({url}) <= {status_code}:{len(body_data)}")
                if status_code == 200 and body_data:
                    if media_type == "application/json":
                        body_str = body_data.decode(charset, errors='ignore')
                        df = pd.DataFrame(json.loads(body_str))
                    elif media_type == "text/csv":
                        body_str = body_data.decode(charset, errors='ignore')
                        df = pd.read_csv(io.StringIO(body_str))
                    else:
                        Logger().log_error(f"HttpClient : getReq({url}) : unknown media-type : {media_type}")
                        df = pd.DataFrame()
                else:
                    df = pd.DataFrame()
                results[idx] = df
            except Exception as e:
                Logger().log_error(f"HttpClient : getReq({url}) exception : {e}")
                results[idx] = pd.DataFrame()
        return results

    def postReq(self, source: str, data: dict) -> Tuple[int, str]:
        project_name, system_name, source_id = source.split(':', 2)
        url = ApiReq._get_url(project_name, system_name, source_id)
        Logger().log_info(f"HttpClient : postReq({url}) => {system_name}:{source_id}")
        fut = self._http_client.post_async_sync_result(url, data)
        try:
            status_code, body_str = fut.result()
            return status_code, body_str
        except Exception as e:
            Logger().log_error(f"HttpClient : postReq({url}) exception : {e}")
            return 500, str(e)

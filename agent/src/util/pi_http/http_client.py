import threading, asyncio, httpx, concurrent.futures
from typing import Tuple, Optional

from util.log_util import Logger


class HttpClient:

    def __init__(self):
        self._logger = Logger()
        self._http_client_sync = httpx.Client()     # not thread-safe
        self._http_client_async = httpx.AsyncClient()
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._loop_ready = threading.Event()
        self._thread = threading.Thread(target=self._start_event_loop, daemon=True)
        self._thread.start()
        self._loop_ready.wait()

    def _start_event_loop(self):
        self._loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._loop)
        self._loop_ready.set()
        self._loop.run_forever()

    @staticmethod
    def _getRsp4Exception(exc: httpx.RequestError) -> int:
        response_code = 500  # "Internal Server Error"
        if isinstance(exc, httpx.ConnectTimeout):
            response_code = 504  # "Gateway Timeout"
        elif isinstance(exc, httpx.ReadTimeout):
            response_code = 504  # "Gateway Timeout"
        elif isinstance(exc, httpx.NetworkError):
            response_code = 503  # "Service Unavailable"
        elif isinstance(exc, httpx.ConnectError):
            response_code = 502  # "Bad Gateway"
        return response_code

    async def _post_async(self, url: str, data: dict, timeout: int=5) -> Tuple[int, str]:
        try:
            response = await self._http_client_async.post(url, json=data, timeout=timeout)
            response_code = response.status_code
            body_str = response.text
            # self._logger.log_verbose(f"http-post(async): {url}-{data} : {response_code}")
        except httpx.RequestError as exc:
            response_code = self._getRsp4Exception(exc)
            body_str = ''
            self._logger.log_error(f"http-post(async): {url}-{data} : exception {exc} : {response_code}")
        except Exception as exc:
            response_code = 500
            body_str = ''
            self._logger.log_error(f"http-post(async): {url}-{data} : exception {exc} : {response_code}")
        return response_code, body_str

    async def _get_async(self, url: str, timeout: int=5) -> Tuple[int, str, bytes]:
        try:
            response = await self._http_client_async.get(url, timeout=timeout)
            response_code = response.status_code
            content_type = response.headers.get('content-type')
            body_data = response.content
            # self._logger.log_verbose(f"http-get(async): {url} : {response_code}")
        except httpx.RequestError as exc:
            response_code = self._getRsp4Exception(exc)
            content_type = ''
            body_data = ''
            self._logger.log_error(f"http-get(async): {url} : exception {exc} : {response_code}")
        except Exception as exc:
            response_code = 500
            content_type = ''
            body_data = ''
            self._logger.log_error(f"http-get(async): {url} : exception {exc} : {response_code}")
        return response_code, content_type, body_data

    def post_async(self, url: str, data: dict, timeout: int=5) -> asyncio.Future:
        future = asyncio.run_coroutine_threadsafe(self._post_async(url, data, timeout), self._loop)
        return asyncio.wrap_future(future)

    def post_async_sync_result(self, url: str, data: dict, timeout: int=5) -> concurrent.futures.Future:
        future = asyncio.run_coroutine_threadsafe(self._post_async(url, data, timeout), self._loop)
        return future

    def get_async(self, url: str, timeout: int=5) -> asyncio.Future:
        future = asyncio.run_coroutine_threadsafe(self._get_async(url, timeout), self._loop)
        return asyncio.wrap_future(future)

    def get_async_sync_result(self, url: str, timeout: int=5) -> concurrent.futures.Future:
        future = asyncio.run_coroutine_threadsafe(self._get_async(url, timeout), self._loop)
        return future

    def post_sync(self, url: str, data: dict, timeout: int=5) -> Tuple[int, str]:
        try:
            response = self._http_client_sync.post(url, json=data, timeout=timeout)
            response_code = response.status_code
            body_str = response.text
            # self._logger.log_verbose(f"http-post(sync): {url}-{data} : {response_code}")
        except httpx.RequestError as exc:
            response_code = self._getRsp4Exception(exc)
            body_str = ''
            self._logger.log_error(f"http-post(sync): {url}-{data} : exception {exc} : {response_code}")
        except Exception as exc:
            response_code = 500
            body_str = ''
            self._logger.log_error(f"http-post(sync): {url}-{data} : exception {exc} : {response_code}")
        return response_code, body_str

    def get_sync(self, url: str, timeout: int=5) -> Tuple[int, str, str]:
        try:
            response = self._http_client_sync.get(url, timeout=timeout)
            response_code = response.status_code
            content_type = response.headers.get('content-type')
            body_data = response.content.decode('utf-8')
            # self._logger.log_verbose(f"http-get(sync): {url} : {response_code}")
        except httpx.RequestError as exc:
            response_code = self._getRsp4Exception(exc)
            body_data = ''
            content_type = ''
            self._logger.log_error(f"http-get(sync): {url} : exception {exc} : {response_code}")
        except Exception as exc:
            response_code = 500
            body_data = ''
            content_type = ''
            self._logger.log_error(f"http-get(sync): {url} : exception {exc} : {response_code}")
        return response_code, content_type, body_data

    def stop(self):
        async def async_stop():
            await self._http_client_async.aclose()

        self._loop.call_soon_threadsafe(self._loop.stop)
        self._thread.join()
        self._http_client_sync.close()
        asyncio.run(async_stop())

import threading, re
import pandas as pd
from typing import List, Tuple
from fastapi import APIRouter, Request
from starlette.responses import JSONResponse, PlainTextResponse, Response

from util.pi_http.http_util import HttpUtil
from util.pi_http.http_handler import BodyData, Server_Dynamic_Handler, HandlerResult, CSVLike
from util.log_util import Logger


Rule = Tuple[re.Pattern, Server_Dynamic_Handler, dict]


def _http_response(result: HandlerResult) -> Response:
    status, body, headers, media = result.status, result.body, result.headers, result.media_type
    if body is None:
        return Response(status_code=status, headers=headers)
    if isinstance(body, dict):
        return JSONResponse(content=body, status_code=status, headers=headers)
    if isinstance(body, pd.DataFrame):
        return Response(content=body.to_csv(index=False), status_code=status, headers=headers, media_type=media or "text/csv")
    if isinstance(body, list):
        return Response(content=HttpUtil.get_csv_content(body), status_code=status, headers=headers, media_type=media or "text/csv")
    if isinstance(body, (bytes, bytearray, memoryview)):
        return Response(content=body, status_code=status, headers=headers, media_type=media or "application/octet-stream")
    if isinstance(body, str):
        return PlainTextResponse(content=body, status_code=status, headers=headers, media_type=media or "text/plain")
    return Response(status_code=status, headers=headers)


class HealthController:

    def __init__(self):
        pass

    async def health(self):
        return {"status": "ok"}


class DynamicController:

    def __init__(self):
        self._logger = Logger()
        self._routes: List[Rule] = []
        self._lock = threading.Lock()

    def add_route(self, pattern: str, handler: Server_Dynamic_Handler, kwargs: dict = None):
        compiled = re.compile(pattern)
        with self._lock:
            self._routes.append((compiled, handler, kwargs))

    def remove_route(self, pattern: str):
        compiled = re.compile(pattern)
        with self._lock:
            self._routes = [(p, h, k) for (p, h, k) in self._routes if p.pattern != compiled.pattern]

    async def route(self, req: Request, full_path: str) -> Response:
        content_type = req.headers.get("content-type", "")
        # content_encoding = req.headers.get("content-encoding", "").lower()
        media_type, charset = HttpUtil.parse_content_type_header(content_type)
        body_data: BodyData = None
        try:
            if req.method in ("POST", "PUT", "PATCH"):
                if media_type == "application/json":
                    body_data = await req.json()
                elif media_type == "text/csv":
                    body_data = []
                    async for csv_row in HttpUtil.iter_csv_rows_from_stream(req.stream(), encoding=charset):
                        body_data.append(csv_row)
                    # suffix = ".csv.gz" if "gzip" in content_encoding else ".csv"
                    # path = await HttpUtil.spool_body_to_temp(req.stream(), suffix=suffix)
                    # body_data = HttpUtil.iter_csv_rows_from_path(path, encoding=charset)
                else:
                    self._logger.log_error(f"HttpServer : route({full_path}) : fail : Unsupported media type: {media_type}")
                    return PlainTextResponse(status_code=415, content=f"Unsupported media type: {media_type}")
        except Exception as e:
            self._logger.log_error(f"HttpServer : route({full_path}) : fail : exception : {e}")
            return PlainTextResponse(status_code=500, content=f"exception : {e}")

        for pattern, handler, kwargs in list(self._routes):
            match = pattern.fullmatch(full_path)
            if match:
                try:
                    handler_result = await handler(match, body_data, kwargs)
                    self._logger.log_info(f"HttpServer : route({full_path}) : rsp={handler_result.status}")
                    return _http_response(handler_result)
                except Exception as e:
                    self._logger.log_error(f"HttpServer : route({full_path}) : fail : exception : {e}")
                    return PlainTextResponse(status_code=500, content=f"exception : {e}")
        self._logger.log_error(f"HttpServer : route({full_path}) : fail : No route")
        return PlainTextResponse(status_code=404, content=f"No route for '{full_path}'")


class HttpServerController:
    SUB_URL_HEALTH = "/health"
    SUB_URL_DYNAMIC = "{full_path:path}"

    def __init__(self, router: APIRouter):
        self._logger = Logger()
        self._dynamic_controller = DynamicController()
        self._health_controller = HealthController()
        self._controller_mapping = {
            HttpServerController.SUB_URL_HEALTH:    (self._health_controller.health, ["GET"]),
            HttpServerController.SUB_URL_DYNAMIC:   (self._dynamic_controller.route, ["GET", "POST", "PUT", "PATCH"])
        }
        self._controller_register(router)

    def _controller_register(self, router: APIRouter):
        for url, (controller, method_list) in self._controller_mapping.items():
            router.add_api_route(url, controller, methods=method_list)

    def add_dynamic_route(self, pattern: str, handler: Server_Dynamic_Handler, kwargs: dict = None):
        self._dynamic_controller.add_route(pattern, handler, kwargs)

    def del_dynamic_route(self, pattern: str):
        self._dynamic_controller.remove_route(pattern)

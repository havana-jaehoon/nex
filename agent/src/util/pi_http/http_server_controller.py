import threading
import pandas as pd
from typing import Dict, Tuple, Optional
from fastapi import APIRouter, Request
from starlette.responses import JSONResponse, PlainTextResponse, Response

from util.pi_http.http_util import HttpUtil, HttpException
from util.pi_http.http_handler import BodyData, Server_Dynamic_Handler, HandlerResult, HandlerArgs
from util.log_util import Logger


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

async def _get_body_from_request(req: Request) -> Optional[BodyData]:
    content_type = req.headers.get("content-type", "")
    # content_encoding = req.headers.get("content-encoding", "").lower()
    media_type, charset = HttpUtil.parse_content_type_header(content_type)
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
                raise HttpException(f"Unsupported media type: {media_type}", 415)
            return body_data
        else:
            return None
    except Exception as e:
        raise HttpException(f"exception : {e}", 500)

async def _encode_reqHandler_args(request: Request) -> HandlerArgs:
    body_data = await _get_body_from_request(request)
    return HandlerArgs(request.method,
                       request.path_params['full_path'],
                       request.client.host,
                       request.client.port,
                       dict(request.query_params),
                       dict(request.headers),
                       request.cookies,
                       body_data)


class HealthController:

    def __init__(self):
        pass

    async def health(self):
        return {"status": "ok"}


class DynamicController:

    def __init__(self):
        self._logger = Logger()
        self._routes: Dict[str, Tuple[Server_Dynamic_Handler, dict]] = {}
        self._lock = threading.Lock()

    def add_route(self, path: str, handler: Server_Dynamic_Handler, kwargs: dict = None):
        with self._lock:
            self._routes[path] = (handler, kwargs)

    def remove_route(self, path: str):
        with self._lock:
            del self._routes[path]

    async def route(self, req: Request, full_path: str) -> Response:
        # encode args
        try:
            handler_args = await _encode_reqHandler_args(req)
        except HttpException as e:
            Logger().log_error(f"HttpServer : route({full_path}) : fail : exception : {e}")
            return PlainTextResponse(status_code=e.error_code, content=e.message)

        # find handler
        match_base_path = ""
        for base_path in self._routes.keys():
            if HttpUtil.is_match_url(base_path, full_path) and len(base_path) > len(match_base_path):
                match_base_path = base_path
        if len(match_base_path) == 0:
            self._logger.log_error(f"HttpServer : route({full_path}) : fail : No route")
            return PlainTextResponse(status_code=404, content=f"No route for '{full_path}'")
        handler, kwargs = self._routes[match_base_path]

        # execute handler
        try:
            handler_result = await handler(handler_args, kwargs)
            self._logger.log_verbose(f"HttpServer : route({full_path}) : rsp={handler_result.status}")
            res = _http_response(handler_result)
            return res
        except Exception as e:
            self._logger.log_error(f"HttpServer : route({full_path}) : fail : exception : {e}")
            return PlainTextResponse(status_code=500, content=f"exception : {e}")


class HttpServerController:
    SUB_URL_HEALTH = "/health"
    SUB_URL_DYNAMIC = "{full_path:path}"

    def __init__(self, router: APIRouter):
        self._logger = Logger()
        self._dynamic_controller = DynamicController()
        self._health_controller = HealthController()
        self._controller_mapping = {
            HttpServerController.SUB_URL_HEALTH:    (self._health_controller.health, ["GET"]),
            HttpServerController.SUB_URL_DYNAMIC:   (self._dynamic_controller.route, ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
        }
        self._controller_register(router)

    def _controller_register(self, router: APIRouter):
        for url, (controller, method_list) in self._controller_mapping.items():
            router.add_api_route(url, controller, methods=method_list)

    def add_dynamic_route(self, path: str, handler: Server_Dynamic_Handler, kwargs: dict = None):
        self._dynamic_controller.add_route(path, handler, kwargs)

    def del_dynamic_route(self, path: str):
        self._dynamic_controller.remove_route(path)

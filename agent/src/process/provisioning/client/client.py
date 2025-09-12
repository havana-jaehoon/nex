
from auth.system_auth import SystemAuth
from process.base_process import *
from util.log_util import Logger

class client(BaseProcess):

    def __init__(self, *args, **kwargs):
        super().__init__()
        self._logger = Logger()
        self._is_req_custom_handler = True

    async def req_custom_handler(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        try:
            if not isinstance(body, dict):
                self._logger.log_error(f'process(auth) : req_custom_handler : invalid body type : {type(body)}')
                return HandlerResult(status=400, body='body is not dict')
            get_data_func = kwargs.get("get_data_func")
            data_df = await get_data_func()
            if SystemAuth.check_auth_key(body, data_df):
                return HandlerResult(status=200)
            else:
                return HandlerResult(status=401, body='authentication is fail')
        except Exception as e:
            self._logger.log_error(f'process(auth) : req_custom_handler : exception : {e}')
            return HandlerResult(status=500, body=f'exception : {e}')

    def process(self,
                sources: Optional[List[str]],
                sources_data: Optional[List[pd.DataFrame]],
                *args, **kwargs) \
            -> Optional[pd.DataFrame]:
        return None
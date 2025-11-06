
from element.element_process import *
from util.pi_http.http_handler import HandlerResult, HandlerArgs, BodyData
from util.log_util import Logger

class transparent(ElementProcess):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def process(self, sources: List[Tuple[str, Optional[pd.DataFrame]]], *args, **kwargs) -> Optional[pd.DataFrame]:
        Logger().log_info(f'transparent : process : {sources}')
        return None
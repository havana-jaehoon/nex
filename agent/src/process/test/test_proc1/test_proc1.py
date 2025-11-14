
from element.element_process import *
from util.pi_http.http_handler import HandlerResult, HandlerArgs, BodyData
from util.log_util import Logger

class test_proc1(ElementProcess):

    data = { }

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def process(self, sources: List[Tuple[str, Optional[pd.DataFrame]]], *args, **kwargs) -> Optional[pd.DataFrame]:
        for source_id, source_data in sources:
            Logger().log_info(f'test_proc1 : {source_id} ======> \n{source_data}')
            return source_data
        return None
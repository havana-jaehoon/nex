
from element.element_process import *
from util.pi_http.http_handler import HandlerResult, HandlerArgs, BodyData
from util.log_util import Logger

class add_test(ElementProcess):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self._index = 0

    def process(self, sources: List[Tuple[str, Optional[pd.DataFrame]]], *args, **kwargs) -> Optional[pd.DataFrame]:
        for source_id, source_data in sources:
            Logger().log_info(f'test_proc1 : {source_id} ======> \n{source_data}')
            if source_data is not None:
                source_data['train_count'] = source_data['train_count'] + self._index
                self._index += 1
                return source_data

        return None
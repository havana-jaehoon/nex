import pandas as pd
from typing import Optional, List

from element.base_process import BaseProcess


class proc_test2(BaseProcess):

    def __init__(self, *args, **kwargs):
        super().__init__()
        self._test_cnt = 100

    def process(self,
                sources: Optional[List[str]],
                sources_data: Optional[List[pd.DataFrame]],
                *args, **kwargs) \
            -> Optional[pd.DataFrame]:
        return sources_data[0]
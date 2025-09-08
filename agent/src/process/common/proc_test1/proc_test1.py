import pandas as pd
from typing import Optional, List

from process.base_process import BaseProcess


class proc_test1(BaseProcess):

    def __init__(self, *args, **kwargs):
        super().__init__()
        self._test_cnt = 1

    def process(self,
                sources: Optional[List[str]],
                sources_data: Optional[List[pd.DataFrame]],
                *args, **kwargs) \
            -> Optional[pd.DataFrame]:
        df = pd.DataFrame({'label': ['train01', 'train02', 'train03'],
                           'alert': [self._test_cnt, self._test_cnt, self._test_cnt],
                           'warning': [self._test_cnt, self._test_cnt, self._test_cnt]
                           })
        self._test_cnt += 1
        return df
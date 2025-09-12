import re
import pandas as pd
from typing import Optional, List
from abc import ABC, abstractmethod

from util.pi_http.http_handler import HandlerResult, BodyData


class BaseProcess(ABC):

    def __init__(self):
        self._is_req_custom_handler = False

    async def req_custom_handler(self, exp: re.Match, body: BodyData, kwargs: dict) -> HandlerResult:
        pass

    @property
    def is_req_custom_handler(self) -> bool:
        return self._is_req_custom_handler

    @abstractmethod
    def process(self,
                sources: Optional[List[str]],
                sources_data: Optional[List[pd.DataFrame]],
                *args, **kwargs) \
            -> Optional[pd.DataFrame]:
        pass

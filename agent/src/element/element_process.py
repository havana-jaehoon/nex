import re
import pandas as pd
from typing import Optional, List, Tuple
from abc import ABC, abstractmethod

from util.pi_http.http_handler import HandlerResult, HandlerArgs


class ElementProcess(ABC):

    def __init__(self):
        self._is_query_custom_handler = False

    async def query_custom_handler(self, handler_args: HandlerArgs, kwargs: dict) -> HandlerResult:
        pass

    @property
    def is_query_custom_handler(self) -> bool:
        return self._is_query_custom_handler

    @abstractmethod
    def process(self, sources: List[Tuple[str, pd.DataFrame]], *args, **kwargs) -> Optional[pd.DataFrame]:
        pass

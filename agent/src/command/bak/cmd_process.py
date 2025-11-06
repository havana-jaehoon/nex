import pandas as pd
from typing import List, Tuple, Optional
from abc import ABC, abstractmethod

from util.pi_http.http_handler import HandlerResult, HandlerArgs


class CmdProcess(ABC):

    def __init__(self, *args, **kwargs):
        pass

    @abstractmethod
    async def process(self,
                      handler_args: HandlerArgs,
                      inputs: List[Tuple[str, Optional[pd.DataFrame]]],
                      kwargs: dict) -> Tuple[HandlerResult, List[pd.DataFrame]]:
        pass


class CmdIntervalProcess(ABC):

    def __init__(self, *args, **kwargs):
        pass

    @abstractmethod
    def process(self, inputs: List[Tuple[str, Optional[pd.DataFrame]]], *args, **kwargs) -> Optional[List[pd.DataFrame]]:
        pass

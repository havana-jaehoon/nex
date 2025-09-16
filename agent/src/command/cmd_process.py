import re
import pandas as pd
from typing import List, Tuple
from abc import ABC, abstractmethod

from util.pi_http.http_handler import HandlerResult, BodyData


class CmdProcess(ABC):

    def __init__(self):
        pass

    @abstractmethod
    async def process(self,
                      exp: re.Match,
                      body: BodyData,
                      inputs: List[Tuple[str, pd.DataFrame]],
                      kwargs: dict) -> Tuple[HandlerResult, List[pd.DataFrame]]:
        pass

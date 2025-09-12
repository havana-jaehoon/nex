import re
import pandas as pd
from typing import List, Union, Dict, Callable, Awaitable, Optional, Any
from dataclasses import dataclass, field


CSVRow = Dict[str, str]
CSVLike = List[CSVRow]
BodyData = Union[None, pd.DataFrame, CSVLike, Dict, bytes, str, Any]


@dataclass
class HandlerResult:
    status: int = 200
    body: Optional[BodyData] = None
    headers: Dict[str, str] = field(default_factory=dict)
    media_type: Optional[str] = None  #"application/json", "text/csv"

Server_Dynamic_Handler = Callable[[re.Match, Optional[BodyData], dict], Awaitable[HandlerResult]]

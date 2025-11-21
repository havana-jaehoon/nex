from typing import Any


class DictUtil:

    @staticmethod
    def normalize(obj: Any):
        if isinstance(obj, dict):
            return (
                "dict",
                tuple(sorted(((k, DictUtil.normalize(v)) for k, v in obj.items()), key=lambda x: x[0])),
            )
        if isinstance(obj, (list, tuple, set)):
            return (
                "list",
                tuple(sorted(DictUtil.normalize(v) for v in obj)),
            )
        return obj

    @staticmethod
    def deep_equal_ignore_order(a: Any, b: Any) -> bool:
        return DictUtil.normalize(a) == DictUtil.normalize(b)
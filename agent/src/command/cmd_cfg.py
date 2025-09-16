from typing import List

import const_def
from element.element_cfg import BaseElementConfig


class CmdConfig(BaseElementConfig):

    def __init__(self, parent_list: List[str], json_data: dict):
        super().__init__(parent_list, json_data)

        json_type = json_data.get("type", '')
        if json_type.upper() != const_def.COMMAND_TYPE.upper():
            raise Exception("CmdConfig : type is not COMMAND")

        self._processor: str = json_data.get("processor")
        if not self._processor: raise Exception("CmdConfig : processor is empty")
        self._inputs: List[str] = json_data.get("inputs")
        self._outputs: List[str] = json_data.get("outputs")

    def _gen_id(self, parent_list: List[str], json_data: dict) -> str:
        parent_path = f'/{"/".join(parent_list)}' if parent_list else ''
        sub_paths = json_data.get("subPaths")
        if sub_paths:
            sub_paths_str = "|".join(sub_paths)
            return fr'{parent_path}/{self._name}/({sub_paths_str})'
        else:
            return f'{parent_path}/{self._name}'

    def _gen_subUrl(self, parent_list: List[str], json_data: dict) -> str:
        return self._gen_id(parent_list, json_data)

    def __str__(self):
        return (f'id={self._id}, '
                f'name={self._name}, '
                f'processor={self._processor}, '                
                f'inputs={self._inputs}, '
                f'outputs={self._outputs}')

    @property
    def processor(self) -> str:
        return self._processor

    @property
    def inputs(self) -> List[str]:
        return self._inputs

    @property
    def outputs(self) -> List[str]:
        return self._outputs

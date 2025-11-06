from abc import ABC, abstractmethod


class TokenBase(ABC):

    def __init__(self, token_name: str, *args, **kwargs):
        self._name = token_name

    @property
    def name(self) -> str:
        return self._name

    @abstractmethod
    def genAuthToken(self, agent_id: str, challenge: str, secret_key: str) -> str:
        pass

    @abstractmethod
    def validateAuthToken(self, auth_token: str, secret_key: str) -> str:
        pass

    @abstractmethod
    def genAccessToken(self, agent_id: str, secret_key: str) -> str:
        pass


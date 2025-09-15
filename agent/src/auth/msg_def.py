
from strenum import StrEnum
from pydantic import BaseModel


class AuthElement(StrEnum):
    AUTH_INIT_ELEMENT = 'initiate'
    AUTH_TOKEN_ELEMENT = 'token'


class AgentInitRequest(BaseModel):
    agent_id: str


class AgentInitResponse(BaseModel):
    token_method: str
    challenge: str


class AgentTokenRequest(BaseModel):
    agent_id: str
    auth_token: str
    ip: str
    port: int


class AgentTokenResponse(BaseModel):
    access_token: str
    token_type: str
    project: str
    system: str
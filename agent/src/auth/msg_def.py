from pydantic import BaseModel


class AgentInitRequest(BaseModel):
    agent_id: str


class AgentInitResponse(BaseModel):
    token_method: str
    challenge: str


class AgentTokenRequest(BaseModel):
    agent_id: str
    auth_token: str


class AgentTokenResponsePayload(BaseModel):
    project: str
    system: str


class AgentTokenResponse(BaseModel):
    access_token: str
    token_type: str
    payload: AgentTokenResponsePayload

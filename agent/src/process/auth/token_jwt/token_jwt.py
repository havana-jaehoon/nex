import jwt
from typing import Optional
from datetime import datetime, timezone, timedelta

from command.auth.auth_process import AuthProcess


class token_jwt(AuthProcess):

    ALGORITHM = "HS256"
    EXPIRE_AUTH = 1     # minute
    EXPIRE_ACCESS = 5   # minute

    def __init__(self):
        super().__init__()

    def _self_name(self) -> str:
        return "/auth/token_jwt"

    def gen_auth_token(self, agent_id: str, challenge: str, secret_key: str) -> str:
        auth_payload = {
            'agent_id': agent_id,
            'challenge': challenge,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=self.EXPIRE_AUTH)
        }
        return jwt.encode(auth_payload, secret_key, algorithm=self.ALGORITHM)

    def validate_auth_token(self, auth_token: str, secret_key: str) -> Optional[str]:
        try:
            decoded_payload = jwt.decode(auth_token, secret_key, algorithms=[self.ALGORITHM])
            expire = decoded_payload.get("exp")
            if not expire or expire < datetime.now(timezone.utc).timestamp():
                return None
            return decoded_payload.get('challenge')
        except jwt.PyJWTError as e:
            return None

    def gen_access_token(self, agent_id: str, secret_key: str) -> str:
        access_payload = {
            'agent_id': agent_id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=self.EXPIRE_ACCESS)
        }
        return jwt.encode(access_payload, secret_key, algorithm=self.ALGORITHM)

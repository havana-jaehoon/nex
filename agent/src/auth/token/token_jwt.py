import jwt
from datetime import timezone, timedelta, datetime
from typing import Optional

from auth.token.token_base import TokenBase


class token_jwt(TokenBase):

    ALGORITHM = "HS256"
    EXPIRE_AUTH = 1     # minute
    EXPIRE_ACCESS = 5   # minute

    def __init__(self, *args, **kwargs):
        super().__init__('token_jwt', args, kwargs)

    def genAuthToken(self, agent_id: str, challenge: str, secret_key: str) -> str:
        auth_payload = {
            'agent_id': agent_id,
            'challenge': challenge,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=token_jwt.EXPIRE_AUTH)
        }
        return jwt.encode(auth_payload, secret_key, algorithm=token_jwt.ALGORITHM)

    def validateAuthToken(self, auth_token: str, secret_key: str) -> Optional[str]:
        try:
            decoded_payload = jwt.decode(auth_token, secret_key, algorithms=[token_jwt.ALGORITHM])
            expire = decoded_payload.get("exp")
            if not expire or expire < datetime.now(timezone.utc).timestamp():
                return None
            return decoded_payload.get('challenge')
        except jwt.PyJWTError as e:
            return None

    def genAccessToken(self, agent_id: str, secret_key: str) -> str:
        access_payload = {
            'agent_id': agent_id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=token_jwt.EXPIRE_ACCESS)
        }
        return jwt.encode(access_payload, secret_key, algorithm=token_jwt.ALGORITHM)

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta, timezone
import os

# --- 설정 (이전 코드와 동일) ---
# 실제 환경에서는 .env 파일 등을 통해 안전하게 관리해야 합니다.
AGENTS_DB = {
    "agent-x-123": "my_super_secret_for_agent_x"
}
SERVER_SECRET_KEY = "server_jwt_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 임시 챌린지 저장소
CHALLENGE_STORE = {}


# --- Pydantic 모델 정의 (데이터 형식 지정) ---
class Token(BaseModel):
    access_token: str
    token_type: str


class AgentRequest(BaseModel):
    agent_id: str


class AuthRequest(BaseModel):
    agent_id: str
    auth_token: str


# --- FastAPI 앱 생성 ---
app = FastAPI()

# `/token` 엔드포인트 URL을 사용하는 OAuth2 호환 보안 스키마
# 이 객체의 역할은 단지 Authorization 헤더에서 토큰을 추출하는 것입니다.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# --- 의존성 (Dependency) 함수 ---
async def get_current_agent(token: str = Depends(oauth2_scheme)):
    """
    보호된 엔드포인트에 사용될 의존성.
    요청 헤더의 Bearer 토큰을 검증하고, 유효하면 agent_id를 반환합니다.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SERVER_SECRET_KEY, algorithms=[ALGORITHM])
        agent_id: str = payload.get("sub")
        if agent_id is None:
            raise credentials_exception
        if agent_id not in AGENTS_DB:  # DB에 있는 사용자인지 추가 확인
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    return agent_id


# --- API 엔드포인트 (라우터) ---

# 1, 2단계: 인증 시작 및 챌린지 반환
@app.post("/auth/initiate")
async def initiate_authentication(request: AgentRequest):
    agent_id = request.agent_id
    if agent_id not in AGENTS_DB:
        raise HTTPException(status_code=404, detail="Agent ID not found")

    challenge = os.urandom(16).hex()
    CHALLENGE_STORE[agent_id] = challenge

    return {"auth_method": "JWT-HS256", "challenge": challenge}


# 3, 4단계: 챌린지 토큰 검증 및 최종 Access Token 발급
@app.post("/token", response_model=Token)
async def login_for_access_token(request: AuthRequest):
    agent_id = request.agent_id
    auth_token = request.auth_token
    agent_secret = AGENTS_DB.get(agent_id)
    stored_challenge = CHALLENGE_STORE.get(agent_id)

    if not agent_secret or not stored_challenge:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication attempt"
        )

    try:
        decoded_payload = jwt.decode(auth_token, agent_secret, algorithms=[ALGORITHM])
        if decoded_payload.get('challenge') != stored_challenge:
            raise jwt.InvalidTokenError
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid challenge token",
        )

    # 인증 성공, Access Token 생성
    del CHALLENGE_STORE[agent_id]  # 챌린지 재사용 방지를 위해 즉시 삭제
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": agent_id, "exp": expire}
    access_token = jwt.encode(to_encode, SERVER_SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": access_token, "token_type": "bearer"}


# 5단계 (활용): 발급받은 Access Token으로 보호된 API에 접근
@app.get("/agents/me")
async def read_agents_me(current_agent_id: str = Depends(get_current_agent)):
    # get_current_agent 의존성이 먼저 실행됩니다.
    # 토큰이 유효하지 않으면 이 코드는 실행되지 않고 401 에러가 발생합니다.
    # 토큰이 유효하면 current_agent_id 변수에 agent_id가 담겨서 들어옵니다.
    return {"agent_id": current_agent_id, "status": "Access Granted"}
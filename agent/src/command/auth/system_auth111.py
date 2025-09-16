
import os
from fastapi import FastAPI, Depends, HTTPException, status, Body
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone


class AgentInitRequest(BaseModel):
    agent_id: str


class AgentInitResponse(BaseModel):
    token_method: str
    challenge: str


class AgentTokenRequest(BaseModel):
    agent_id: str
    auth_token: str


class AgentTokenResponse(BaseModel):
    access_token: str
    token_type: str
    project: str
    system: str


class AuthApi:

    def __init__(self):
        # --- 서버 설정 ---
        self.AGENTS_DB = {"agent-x-123": "my_super_secret_for_agent_x"}
        self.SERVER_SECRET_KEY = "server_jwt_secret_key"
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 15
        self.CHALLENGE_STORE = {}
        self.app = FastAPI()
        self._register_routes()

    def _register_routes(self):
        """API 엔드포인트를 등록합니다."""
        self.app.post("/auth/initiate")(self.initiate_authentication)
        self.app.post("/token")(self.login_for_access_token)
        self.app.post("/token/refresh")(self.refresh_access_token)
        # 클래스 내부의 의존성 주입을 위한 준비
        self.app.get("/agents/me")(self.read_agents_me)

    # --- 의존성 (Dependency) 함수 ---
    async def get_current_agent(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
        try:
            payload = jwt.decode(token, self.SERVER_SECRET_KEY, algorithms=[self.ALGORITHM])
            agent_id: str = payload.get("sub")
            if agent_id is None or agent_id not in self.AGENTS_DB:
                raise credentials_exception
        except jwt.PyJWTError:
            raise credentials_exception
        return agent_id

    # --- API 엔드포인트 메서드 ---
    async def initiate_authentication(self, request: AgentRequest):
        agent_id = request.agent_id
        if agent_id not in self.AGENTS_DB:
            raise HTTPException(status_code=404, detail="Agent ID not found")
        challenge = os.urandom(16).hex()
        self.CHALLENGE_STORE[agent_id] = challenge
        return {"auth_method": "JWT-HS256", "challenge": challenge}

    async def login_for_access_token(self, request: dict):
        agent_id = request.get("agent_id")
        auth_token = request.get("auth_token")
        agent_secret = self.AGENTS_DB.get(agent_id)
        stored_challenge = self.CHALLENGE_STORE.get(agent_id)

        if not all([agent_id, auth_token, agent_secret, stored_challenge]):
            raise HTTPException(status_code=400, detail="Invalid request")

        try:
            decoded_payload = jwt.decode(auth_token, agent_secret, algorithms=[self.ALGORITHM])
            if decoded_payload.get('challenge') != stored_challenge:
                raise jwt.InvalidTokenError
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid challenge token")

        del self.CHALLENGE_STORE[agent_id]
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"sub": agent_id, "exp": expire}
        access_token = jwt.encode(to_encode, self.SERVER_SECRET_KEY, algorithm=self.ALGORITHM)
        return {"access_token": access_token, "token_type": "bearer"}

    async def refresh_access_token(self, refresh_token: str = Body(..., embed=True)):
        # ... 리프레시 토큰 로직 구현 ...
        pass

    async def read_agents_me(self, current_agent_id: str = Depends(get_current_agent)):
        return {"agent_id": current_agent_id, "status": "Access Granted"}


# 서버 인스턴스 생성 및 실행
auth_server = AuthServer()
app = auth_server.app  # FastAPI 앱 인스턴스 연결

# OAuth2 스키마 정의 (의존성 주입을 위해 전역 범위에 있어야 할 수 있음)
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 의존성 함수를 클래스 인스턴스에 바인딩
app.get("/agents/me")(auth_server.read_agents_me)
# Depends에 클래스 메서드를 직접 전달
app.dependencies.append(Depends(auth_server.get_current_agent))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# run_client.py

import requests
import jwt
from datetime import datetime, timezone, timedelta


class AuthClient:
    def __init__(self, agent_id: str, secret_key: str, base_url: str):
        self.agent_id = agent_id
        self.secret_key = secret_key
        self.base_url = base_url
        self.access_token = None
        self.session = requests.Session()  # HTTP 연결 재사용을 위한 세션 객체

    def _make_request(self, method, endpoint, **kwargs):
        """중앙 집중식 요청 처리 메서드"""
        try:
            response = self.session.request(method, f"{self.base_url}{endpoint}", **kwargs)
            response.raise_for_status()  # 2xx 상태 코드가 아니면 예외 발생
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"🚨 요청 실패: {e.response.text if e.response else e}")
            return None

    def full_authentication_flow(self):
        """1~4단계의 전체 인증 흐름을 실행합니다."""
        print(f"\n--- 認証フロー開始 (Agent: {self.agent_id}) ---")

        # 1 & 2 단계: 인증 시작 및 챌린지 수신
        print("\n[CLIENT] 1. 서버에 Agent ID 전송 및 챌린지 요청...")
        init_data = {"agent_id": self.agent_id}
        init_response = self._make_request("POST", "/auth/initiate", json=init_data)
        if not init_response: return

        challenge = init_response.get("challenge")
        print(f"[CLIENT] 2. 챌린지 수신 완료: {challenge}")

        # 3 단계: 인증 토큰 생성 및 전송
        print("\n[CLIENT] 3. 챌린지로 인증 토큰 생성 및 서버에 전송...")
        auth_payload = {
            'agentId': self.agent_id,
            'challenge': challenge,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=1)
        }
        auth_token = jwt.encode(auth_payload, self.secret_key, algorithm="HS256")

        token_data = {"agent_id": self.agent_id, "auth_token": auth_token}
        token_response = self._make_request("POST", "/token", json=token_data)
        if not token_response: return

        # 4 단계: 최종 Access Token 수신 및 저장
        self.access_token = token_response.get("access_token")
        print("[CLIENT] 4. 🎉 최종 Access Token 수신 성공!")
        print("------------------------------------------")

    def get_my_info(self):
        """보호된 API에 접근하여 내 정보를 가져옵니다."""
        if not self.access_token:
            print("🚨 먼저 인증을 실행해야 합니다.")
            return

        print("\n--- 보호된 API 접근 시도 ---")
        headers = {"Authorization": f"Bearer {self.access_token}"}
        info = self._make_request("GET", "/agents/me", headers=headers)

        if info:
            print(f"✅ 접근 성공! 서버 응답: {info}")
        print("----------------------------")


# --- 클라이언트 실행 ---
if __name__ == "__main__":
    # 서버와 미리 약속된 클라이언트 정보
    CLIENT_ID = "agent-x-123"
    CLIENT_SECRET = "my_super_secret_for_agent_x"
    SERVER_URL = "http://127.0.0.1:8000"

    # 1. 클라이언트 객체 생성
    client = AuthClient(agent_id=CLIENT_ID, secret_key=CLIENT_SECRET, base_url=SERVER_URL)

    # 2. 전체 인증 흐름 실행
    client.full_authentication_flow()

    # 3. 발급받은 토큰으로 보호된 API에 접근
    client.get_my_info()
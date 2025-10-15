# python version 3.12 기준

# 0. 환경 구성

# 0.1 가상환경 만들기

python -m venv venv

# 0.2 가상환경 활성화

# linux(bash)

source venv/bin/activate

# Windows (PowerShell)

.\venv\Scripts\Activate

# 0.3 pip 업그레이드 & setuptoos 설치

pip install --upgrade pip setuptools wheel

# 1.0 패키지 전체 설치

pip install -r requirements.txt

# 1.1 현재 환경에 상용되는 PKG 파일을 저장

pip freeze > requirements.txt

# 2. 실행

# 2.1 실행 Path 환경 설정(windows)

.\venv\Scripts\Activate
$env:PYTHONPATH = ".\src"

# 2.2 실행

# back-end

python src/system_node.py --config-dir=config_nex

# web

http://127.0.0.1:9070/admin-api/get?system=*&element=/admin/element

# 2.3 test

python .\src\command\config_reader.py

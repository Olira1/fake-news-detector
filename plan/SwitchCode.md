Local ML mode: .\scripts\switch-ml-env.ps1 local
Remote ML mode: .\scripts\switch-ml-env.ps1 remote
start ml-service: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
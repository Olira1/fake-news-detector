Local ML mode: .\scripts\switch-ml-env.ps1 local

Remote ML mode: .\scripts\switch-ml-env.ps1 remote

start ml-service: .\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Set TiDB URL for this terminal session: $env:DATABASE_URL="mysql://4A89PumRvQzwpu3.root:cKCocp58Ni9bnCXj@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"

database gara locallytti debisuuf: Remove-Item Env:DATABASE_URL
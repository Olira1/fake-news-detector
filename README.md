# Fake News Detector Monorepo

This repository is organized as independent services:

- `frontend` - React + Tailwind app
- `backend` - Node.js + Express API
- `ml-service` - FastAPI inference service
- `database` - Prisma schema, migrations, seed scripts

## Environment Files

- `.envDevelopment` for local development
- `.envProduction` for production deployment

Use the provided example files:

- `.envDevelopment.example`
- `.envProduction.example`

## Phase 9 Production Config (Finalized)

### 1) Backend (Render)

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `DATABASE_URL` (TiDB connection string with `sslaccept=strict`)
  - `ML_SERVICE_URL` (Render ML URL)
  - `ML_REQUEST_TIMEOUT_MS=30000`
  - `ML_MAX_RETRIES=1`
  - `ML_RETRY_DELAY_MS=800`
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
  - `JWT_SECRET`

### 2) ML Service (Render)

- Root directory: `ml-service`
- Build command: `pip install -r requirements.txt`
- Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Runtime pin: `ml-service/runtime.txt` (`python-3.12.10`)
- Required environment variables:
  - `PORT=10000` (or Render default)
  - `MODEL_PATH=./model.pkl`

### 3) Frontend (Vercel)

- Root directory: `frontend`
- Build/output settings can stay auto-detected for Vite.
- Required environment variables:
  - `VITE_BACKEND_URL=https://<your-backend-service>.onrender.com`

### 4) Database (TiDB)

- Use TiDB connection string in `DATABASE_URL`.
- Apply migrations before backend go-live:
  - from `database/`: `npm run migrate:deploy`

## Recommended Deploy Order

1. Database migration (TiDB)
2. ML service (Render)
3. Backend service (Render)
4. Frontend (Vercel)

## Local vs Production Separation

- Local development uses `.envDevelopment`.
- Production deployment values come from `.envProduction`.
- `.envProduction.example` is template-only (safe placeholders).

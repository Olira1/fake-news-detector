# Backend

Node.js + Express backend service for Fake News Detector.

## Available Endpoints

- `GET /health`
- `GET /health/full`
- `POST /api/auth/login`
- `GET /api/news`
- `POST /api/news`
- `PUT /api/news/:id`
- `DELETE /api/news/:id`
- `GET /api/predictions`
- `POST /api/predict` with body: `{ "text": "..." }`
- `POST /predict` (backward-compatible alias)

## Run Locally

```bash
npm install
npm run dev
```

Backend loads env automatically:

- `NODE_ENV=development` -> `../.envDevelopment`
- `NODE_ENV=production` -> `../.envProduction`

## Deploy (Render)

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

## ML Integration Tuning

Optional environment variables:

- `ML_REQUEST_TIMEOUT_MS` (default `30000`)
- `ML_MAX_RETRIES` (default `1`)
- `ML_RETRY_DELAY_MS` (default `800`)

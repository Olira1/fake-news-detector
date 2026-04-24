# Backend

Node.js + Express backend service for Fake News Detector.

## Available Endpoints

- `GET /health`
- `GET /health/full`
- `POST /predict` with body: `{ "text": "..." }`

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

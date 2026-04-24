# ML Service

Python FastAPI service for fake news prediction.

## Responsibilities

- Serve `/predict` endpoint with stable response contract
- Use TF-IDF + Logistic Regression model (scikit-learn)
- Persist model at `model.pkl` (bootstrap if missing)
- Expose `/health` endpoint for deployment monitoring
- Expose optional `/train` endpoint for retraining

## Run Locally

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Contract

- `POST /predict`
  - Request: `{ "text": "..." }`
  - Response: `{ "prediction": "Fake|True", "confidence": 0.0-1.0, "source": "..." }`

- `POST /train` (optional)
  - Request: `{ "samples": [{ "text": "...", "label": "fake|true" }] }`
  - Response: training summary

from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(title="Fake News Detector ML Service", version="0.1.0")


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="News text to classify")


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    source: str


@app.get("/health")
def health() -> dict:
    return {
        "message": "HELLO_WORLD_ML_OK",
        "service": "ml-service",
        "status": "ok",
        "mode": "dummy",
    }


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    normalized = payload.text.lower()

    # Dummy heuristic placeholder until real model integration is added.
    fake_keywords = ["shocking", "breaking", "secret", "hoax", "click here"]
    match_count = sum(1 for keyword in fake_keywords if keyword in normalized)

    if match_count >= 2:
        prediction = "Fake"
        confidence = 0.82
    elif match_count == 1:
        prediction = "Fake"
        confidence = 0.64
    else:
        prediction = "True"
        confidence = 0.61

    return PredictResponse(
        prediction=prediction,
        confidence=confidence,
        source="dummy-heuristic-v1",
    )

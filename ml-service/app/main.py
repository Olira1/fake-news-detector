from fastapi import FastAPI

from .model_service import ModelService
from .schemas import PredictRequest, PredictResponse, TrainRequest, TrainResponse

app = FastAPI(title="Fake News Detector ML Service", version="0.2.0")
model_service = ModelService()


@app.on_event("startup")
def on_startup() -> None:
    model_service.load_or_bootstrap()


@app.get("/health")
def health() -> dict:
    return {
        "message": "HELLO_WORLD_ML_OK",
        "service": "ml-service",
        "status": "ok",
        "mode": "tfidf-logreg",
        "model_source": model_service.model_source,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    output = model_service.predict(payload.text)
    return PredictResponse(
        prediction=output["prediction"],
        confidence=output["confidence"],
        source=output["source"],
    )


@app.post("/train", response_model=TrainResponse)
def train(payload: TrainRequest) -> TrainResponse:
    trained_samples = model_service.train(payload.samples)
    return TrainResponse(
        message="Training completed",
        source=model_service.model_source,
        trained_samples=trained_samples,
    )

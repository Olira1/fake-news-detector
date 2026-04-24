from pydantic import BaseModel, Field, field_validator


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="News text to classify")


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    source: str


class TrainSample(BaseModel):
    text: str = Field(..., min_length=1)
    label: str = Field(..., description="Allowed: fake or true")

    @field_validator("label")
    @classmethod
    def validate_label(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in {"fake", "true"}:
            raise ValueError("label must be 'fake' or 'true'")
        return normalized


class TrainRequest(BaseModel):
    samples: list[TrainSample] = Field(default_factory=list)


class TrainResponse(BaseModel):
    message: str
    source: str
    trained_samples: int

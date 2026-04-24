from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from .schemas import TrainSample


DEFAULT_DATASET: list[dict[str, str]] = [
    {"text": "Breaking secret government plan leaked click here now", "label": "fake"},
    {"text": "Shocking hoax article claims impossible event", "label": "fake"},
    {"text": "Experts confirm rumor is a fabricated hoax", "label": "fake"},
    {"text": "Official report confirms economic growth this quarter", "label": "true"},
    {"text": "Health ministry releases verified public safety guidance", "label": "true"},
    {"text": "University study publishes peer reviewed findings", "label": "true"},
]


class ModelService:
    def __init__(self) -> None:
        model_path_value = os.getenv("MODEL_PATH", "./model.pkl")
        self.model_path = Path(model_path_value).resolve()
        self.pipeline: Pipeline | None = None
        self.model_source = "uninitialized"

    def _build_pipeline(self) -> Pipeline:
        return Pipeline(
            [
                ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
                ("clf", LogisticRegression(max_iter=200, random_state=42)),
            ]
        )

    def _fit_and_store(self, samples: Iterable[dict[str, str]], source: str) -> int:
        rows = list(samples)
        texts = [row["text"] for row in rows]
        labels = [row["label"] for row in rows]

        pipeline = self._build_pipeline()
        pipeline.fit(texts, labels)

        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(pipeline, self.model_path)

        self.pipeline = pipeline
        self.model_source = source
        return len(rows)

    def load_or_bootstrap(self) -> str:
        if self.model_path.exists():
            self.pipeline = joblib.load(self.model_path)
            self.model_source = "model.pkl"
            return self.model_source

        self._fit_and_store(DEFAULT_DATASET, "bootstrap-default")
        return self.model_source

    def train(self, train_samples: list[TrainSample]) -> int:
        incoming_rows = [{"text": item.text, "label": item.label} for item in train_samples]
        all_rows = [*DEFAULT_DATASET, *incoming_rows]
        return self._fit_and_store(all_rows, "retrained")

    def predict(self, text: str) -> dict[str, float | str]:
        if self.pipeline is None:
            self.load_or_bootstrap()

        assert self.pipeline is not None

        probabilities = self.pipeline.predict_proba([text])[0]
        classes = list(self.pipeline.classes_)
        predicted_index = int(probabilities.argmax())
        raw_label = classes[predicted_index]

        prediction = "Fake" if raw_label == "fake" else "True"
        confidence = float(probabilities[predicted_index])

        return {
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "source": f"tfidf-logreg:{self.model_source}",
        }

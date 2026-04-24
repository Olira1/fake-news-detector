import axios from "axios";
import { env } from "../config/env.js";

const mlClient = axios.create({
  baseURL: env.mlServiceUrl,
  timeout: env.mlRequestTimeoutMs,
});

class MlServiceError extends Error {
  constructor(message, code = "ML_SERVICE_ERROR", statusCode = 502, details = null) {
    super(message);
    this.name = "MlServiceError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizePrediction(payload) {
  const rawPrediction = payload?.prediction;
  const rawConfidence = Number(payload?.confidence);

  const predictionText =
    typeof rawPrediction === "string" ? rawPrediction.trim().toLowerCase() : "";
  const prediction =
    predictionText === "fake" ? "Fake" : predictionText === "true" ? "True" : null;

  if (!prediction || Number.isNaN(rawConfidence)) {
    throw new MlServiceError(
      "ML service response format is invalid",
      "ML_INVALID_RESPONSE",
      502,
      payload
    );
  }

  // Keep confidence in [0, 1] to keep API contract stable.
  const confidence = Math.min(1, Math.max(0, rawConfidence));

  return {
    prediction,
    confidence,
  };
}

function mapAxiosError(error) {
  if (error?.response?.status) {
    const status = error.response.status;
    const message =
      error.response.data?.message || `ML service request failed with status ${status}`;
    return new MlServiceError(message, "ML_BAD_RESPONSE", 502, {
      upstreamStatus: status,
      upstreamBody: error.response.data,
    });
  }

  if (error?.code === "ECONNABORTED") {
    return new MlServiceError(
      "ML service timeout",
      "ML_TIMEOUT",
      504,
      `Request exceeded ${env.mlRequestTimeoutMs}ms`
    );
  }

  return new MlServiceError(
    "ML service is unreachable",
    "ML_UNREACHABLE",
    502,
    error?.message || "Unknown network error"
  );
}

async function withRetries(action) {
  let lastError;

  for (let attempt = 0; attempt <= env.mlMaxRetries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = mapAxiosError(error);
      const isFinalAttempt = attempt === env.mlMaxRetries;
      if (isFinalAttempt) {
        throw lastError;
      }
      await sleep(env.mlRetryDelayMs);
    }
  }

  throw lastError;
}

export async function checkMlHealth() {
  try {
    const { data } = await withRetries(() => mlClient.get("/health"));
    return {
      status: "ok",
      message: data?.message || "HELLO_WORLD_ML_OK",
    };
  } catch (error) {
    if (error instanceof MlServiceError) {
      throw error;
    }
    throw new MlServiceError("ML health check failed");
  }
}

export async function predictWithMl(text) {
  try {
    const { data } = await withRetries(() => mlClient.post("/predict", { text }));
    return normalizePrediction(data);
  } catch (error) {
    if (error instanceof MlServiceError) {
      throw error;
    }
    throw new MlServiceError("ML prediction failed");
  }
}

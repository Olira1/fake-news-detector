import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { checkDatabaseHealth } from "./lib/db.js";
import { checkMlHealth, predictWithMl } from "./lib/mlClient.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    message: "HELLO_WORLD_BACKEND_OK",
    service: "backend",
    status: "ok",
    env: env.nodeEnv,
  });
});

app.get("/health/full", async (_req, res) => {
  const result = {
    message: "HELLO_WORLD_BACKEND_OK",
    service: "backend",
    env: env.nodeEnv,
    database: { status: "error", message: "UNKNOWN" },
    mlService: { status: "error", message: "UNKNOWN" },
  };

  let hasError = false;

  try {
    result.database = await checkDatabaseHealth();
  } catch (error) {
    hasError = true;
    result.database = {
      status: "error",
      message: error.message || "DATABASE_CHECK_FAILED",
    };
  }

  try {
    result.mlService = await checkMlHealth();
  } catch (error) {
    hasError = true;
    result.mlService = {
      status: "error",
      message: error.message || "ML_CHECK_FAILED",
    };
  }

  if (hasError) {
    return res.status(503).json(result);
  }

  return res.json(result);
});

app.post("/predict", async (req, res) => {
  const text = req.body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  try {
    const prediction = await predictWithMl(text.trim());
    return res.json(prediction);
  } catch (error) {
    return res.status(502).json({
      message: "Failed to get prediction from ML service",
      details: error.message,
    });
  }
});

export default app;

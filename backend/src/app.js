import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import {
  checkDatabaseHealth,
  createNews,
  deleteNewsById,
  listNews,
  listPredictions,
  savePrediction,
  updateNewsById,
} from "./lib/db.js";
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

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username === env.adminUsername && password === env.adminPassword) {
    return res.json({
      message: "Login successful",
      user: { role: "admin", username: env.adminUsername },
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/news", async (_req, res) => {
  try {
    const news = await listNews();
    return res.json(news);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch news", details: error.message });
  }
});

app.post("/api/news", async (req, res) => {
  const { title, content, label } = req.body || {};
  const normalizedLabel = typeof label === "string" ? label.toLowerCase() : "";

  if (!title?.trim() || !content?.trim() || !["fake", "true"].includes(normalizedLabel)) {
    return res.status(400).json({
      message: "title, content and label ('fake' or 'true') are required",
    });
  }

  try {
    const created = await createNews({
      title: title.trim(),
      content: content.trim(),
      label: normalizedLabel,
    });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create news", details: error.message });
  }
});

app.put("/api/news/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content, label } = req.body || {};
  const normalizedLabel = typeof label === "string" ? label.toLowerCase() : "";

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Valid news id is required" });
  }

  if (!title?.trim() || !content?.trim() || !["fake", "true"].includes(normalizedLabel)) {
    return res.status(400).json({
      message: "title, content and label ('fake' or 'true') are required",
    });
  }

  try {
    const affectedRows = await updateNewsById(id, {
      title: title.trim(),
      content: content.trim(),
      label: normalizedLabel,
    });

    if (!affectedRows) {
      return res.status(404).json({ message: "News not found" });
    }

    return res.json({ message: "News updated", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update news", details: error.message });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Valid news id is required" });
  }

  try {
    const affectedRows = await deleteNewsById(id);
    if (!affectedRows) {
      return res.status(404).json({ message: "News not found" });
    }
    return res.json({ message: "News deleted", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete news", details: error.message });
  }
});

app.get("/api/predictions", async (_req, res) => {
  try {
    const predictions = await listPredictions();
    return res.json(predictions);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch prediction history",
      details: error.message,
    });
  }
});

async function handlePredict(req, res) {
  const text = req.body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  try {
    const normalizedText = text.trim();
    const prediction = await predictWithMl(normalizedText);

    await savePrediction({
      inputText: normalizedText,
      prediction: prediction.prediction,
      confidence: Number(prediction.confidence),
    });

    return res.json(prediction);
  } catch (error) {
    return res.status(502).json({
      message: "Failed to get prediction from ML service",
      details: error.message,
    });
  }
}

app.post("/api/predict", handlePredict);
app.post("/predict", handlePredict);

export default app;

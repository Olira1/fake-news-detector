import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const repoRoot = path.resolve(process.cwd(), "..");
const nodeEnv = process.env.NODE_ENV === "production" ? "production" : "development";
const envFile = nodeEnv === "production" ? ".envProduction" : ".envDevelopment";
const envPath = path.join(repoRoot, envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL || "",
  mlServiceUrl: process.env.ML_SERVICE_URL || "",
  mlRequestTimeoutMs: Number(process.env.ML_REQUEST_TIMEOUT_MS || 30000),
  mlMaxRetries: Number(process.env.ML_MAX_RETRIES || 1),
  mlRetryDelayMs: Number(process.env.ML_RETRY_DELAY_MS || 800),
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!env.mlServiceUrl) {
  throw new Error("ML_SERVICE_URL is required");
}

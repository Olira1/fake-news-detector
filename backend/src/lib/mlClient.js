import axios from "axios";
import { env } from "../config/env.js";

const mlClient = axios.create({
  baseURL: env.mlServiceUrl,
  timeout: 10000,
});

export async function checkMlHealth() {
  const { data } = await mlClient.get("/health");
  return {
    status: "ok",
    message: data?.message || "HELLO_WORLD_ML_OK",
  };
}

export async function predictWithMl(text) {
  const { data } = await mlClient.post("/predict", { text });
  return data;
}

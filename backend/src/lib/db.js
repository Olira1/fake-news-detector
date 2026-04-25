import mysql from "mysql2/promise";
import { env } from "../config/env.js";

function buildDbOptions() {
  const url = new URL(env.databaseUrl);
  const isTiDb = url.hostname.includes("tidbcloud.com");

  return {
    uri: env.databaseUrl,
    connectTimeout: 10000,
    ssl: isTiDb ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
  };
}

const pool = mysql.createPool({
  ...buildDbOptions(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function checkDatabaseHealth() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  const ok = Array.isArray(rows) && rows[0]?.ok === 1;

  return {
    status: ok ? "ok" : "error",
    message: ok ? "HELLO_WORLD_DB_OK" : "DB_HEALTH_QUERY_FAILED",
  };
}

export async function listNews() {
  const [rows] = await pool.query(
    "SELECT id, title, content, label, created_at FROM news ORDER BY created_at DESC"
  );
  return rows;
}

export async function listNewsForTraining() {
  const [rows] = await pool.query(
    "SELECT title, content, label FROM news ORDER BY created_at DESC"
  );
  return rows;
}

export async function createNews({ title, content, label }) {
  const [result] = await pool.query(
    "INSERT INTO news (title, content, label) VALUES (?, ?, ?)",
    [title, content, label]
  );

  return {
    id: result.insertId,
    title,
    content,
    label,
  };
}

export async function updateNewsById(id, { title, content, label }) {
  const [result] = await pool.query(
    "UPDATE news SET title = ?, content = ?, label = ? WHERE id = ?",
    [title, content, label, id]
  );
  return result.affectedRows;
}

export async function deleteNewsById(id) {
  const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);
  return result.affectedRows;
}

export async function savePrediction({ inputText, prediction, confidence }) {
  const [result] = await pool.query(
    "INSERT INTO predictions (input_text, prediction, confidence) VALUES (?, ?, ?)",
    [inputText, prediction, confidence]
  );
  return result.insertId;
}

export async function listPredictions() {
  const [rows] = await pool.query(
    "SELECT id, input_text, prediction, confidence, created_at FROM predictions ORDER BY created_at DESC"
  );
  return rows;
}

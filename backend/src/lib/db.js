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

export async function checkDatabaseHealth() {
  const dbOptions = buildDbOptions();
  const connection = await mysql.createConnection(dbOptions);

  try {
    const [rows] = await connection.query("SELECT 1 AS ok");
    const ok = Array.isArray(rows) && rows[0]?.ok === 1;

    return {
      status: ok ? "ok" : "error",
      message: ok ? "HELLO_WORLD_DB_OK" : "DB_HEALTH_QUERY_FAILED",
    };
  } finally {
    await connection.end();
  }
}

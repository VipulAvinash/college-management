import "dotenv/config";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = process.env.DATABASE_URL;

// Global singleton caching pattern for Next.js Serverless environment
declare global {
  // eslint-disable-next-line no-var
  var __dbClient: postgres.Sql | undefined;
  // eslint-disable-next-line no-var
  var __drizzleDb: PostgresJsDatabase<typeof schema> | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

let queryClient: postgres.Sql;

if (isProduction) {
  queryClient = postgres(connectionString, {
    max: 1,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : "require",
    connect_timeout: 10
  });
} else {
  if (!globalThis.__dbClient) {
    globalThis.__dbClient = postgres(connectionString, {
      max: 10,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : "require"
    });
  }
  queryClient = globalThis.__dbClient;
}

export const db = isProduction
  ? drizzle(queryClient, { schema })
  : globalThis.__drizzleDb ?? (globalThis.__drizzleDb = drizzle(queryClient, { schema }));

export type Database = typeof db;

import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// A single shared connection pool for the whole app (serverless-friendly
// settings kept modest; tune `max` for your deployment target).
const queryClient = postgres(process.env.DATABASE_URL, { max: 10 });

export const db = drizzle(queryClient, { schema });
export type Database = typeof db;

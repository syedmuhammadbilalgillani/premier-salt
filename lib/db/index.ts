// Make sure to install the 'postgres' package
import { drizzle } from "drizzle-orm/postgres-js";
import "dotenv/config";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL || "";
if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// In dev, Next.js Fast Refresh re-evaluates this module on every save to a
// file that imports it — even transitively. Without caching the client on
// globalThis, each reload opens a brand new connection pool without closing
// the previous one, eventually exhausting the database's max_connections.
// Caching on globalThis survives HMR reloads within the same process.
declare global {
  var __dbQueryClient: ReturnType<typeof postgres> | undefined;
}

const queryClient =
  process.env.NODE_ENV === "production"
    ? postgres(DB_URL)
    : (globalThis.__dbQueryClient ??= postgres(DB_URL));

export const db = drizzle({ client: queryClient });

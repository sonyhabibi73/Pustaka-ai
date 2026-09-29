import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads .env files itself, and `dotenv` alone would only
// see .env while Next.js also reads .env.local. Load both, in that order, so
// `prisma generate`/`migrate` see the same values as the app.
loadEnv({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Read lazily instead of `env("DATABASE_URL")`: that helper throws while the
  // config file loads, which would fail `prisma generate` before any .env
  // exists. Commands that genuinely connect still fail with a clear message.
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

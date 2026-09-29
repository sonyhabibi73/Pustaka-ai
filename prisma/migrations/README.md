# Migrations

`20260928000000_init` is the checked-in baseline. It was produced with
`prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`,
because Prisma's schema engine reports `vector(1536)` as an unsupported type and
cannot author that column itself. Two pgvector statements are appended by hand:

```sql
CREATE EXTENSION IF NOT EXISTS vector;                       -- before the tables
CREATE INDEX IF NOT EXISTS "DocumentChunk_embedding_hnsw_idx"
  ON "DocumentChunk" USING hnsw ("embedding" vector_cosine_ops);  -- after them
```

`CREATE EXTENSION` must run before `CREATE TABLE "DocumentChunk"` (which
declares `"embedding" vector(1536)`), and the HNSW index must run after it.
Both live in `migration.sql` in that order, so plain `prisma migrate deploy`
works on a Supabase/Neon database with the `vector` extension available.

## Applying

```bash
pnpm db:deploy        # production / CI: applies pending migrations
pnpm db:migrate       # development: applies and records the migration
```

## Adding a migration

1. `pnpm exec prisma migrate dev --name <name> --create-only`
2. If the change touches `DocumentChunk.embedding`, verify the vector DDL is
   emitted as `vector(1536)`; if Prisma omits it, add the column and index
   statements manually as above.
3. `pnpm db:migrate` to apply.

All application vector reads and writes use Prisma parameterized tagged
templates; no user input is concatenated into SQL.

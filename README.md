# Pelajari AI

Document-grounded study workspace: upload a PDF/TXT/DOCX or YouTube URL, then learn through source-bound summaries, flashcards, quizzes, and RAG chat.

## Run locally

1. Copy `.env.example` to `.env.local` and set Supabase Postgres/Storage, Google OAuth + Gemini, OpenAI, and Upstash credentials.
2. Create a private Supabase Storage bucket named `study-materials`.
3. Install dependencies: `corepack pnpm install`.
4. Run `pnpm db:generate`, then `pnpm db:deploy` (see [`prisma/migrations/README.md`](prisma/migrations/README.md) for how the pgvector baseline is structured).
5. Start the app with `pnpm dev`.

`prisma.config.ts` loads `.env.local` then `.env` itself — Prisma 7 no longer reads them, and `dotenv` alone would only see `.env`.

## Quality gates

```bash
pnpm test:all
```

Runs, in order: `format`, `lint`, `typecheck`, `test` (Vitest), `test:e2e` (Playwright, `playwright install chromium` once).

Unit suites cover the parts that must not regress:

| Suite               | Verifies                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `chunk`             | overlap and lossless coverage of the source text                                                   |
| `extract`           | real PDF and DOCX fixtures extract readable text; invalid UTF-8 and unknown MIME fail              |
| `validation`        | 10 MB limit, MIME allow list, signature sniffing, YouTube URL host/id rules                        |
| `vector-store`      | pgvector SQL is parameter-bound, `LIMIT` clamped, malformed embeddings rejected                    |
| `ai-grounding`      | the prompt pins answers to document context with an exact fallback sentence; Markdown sanitization |
| `security`          | error mapping never leaks internals; rate limiting fails closed in production                      |
| `spaced-repetition` | SM-2 style scheduling                                                                              |

Integration tests should run against an isolated Supabase project with test credentials.

## Security controls

- Server-side MIME and file-signature validation; 10 MB maximum upload
- Private Supabase object storage and ownership checks on every document API route
- Database-backed Auth.js sessions, per-user rate limiting with mandatory Upstash in production
- Zod input validation, Prisma queries, and parameter-bound pgvector operations
- Sanitized Markdown with raw HTML disabled; React escaping for chat content
- RAG threshold and fixed Indonesian fallback for unsupported answers

## Stack

Next.js 16 App Router · TypeScript strict · Tailwind + shadcn/ui · Prisma 7 (Postgres + pgvector) · Vercel AI SDK (`gemini-3.5-flash-lite` generation, `gemini-embedding-001` embeddings at 1536 dims) · NextAuth v5 · Upstash rate limiting.

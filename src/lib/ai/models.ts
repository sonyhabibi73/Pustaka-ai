import "server-only";
import { google } from "@ai-sdk/google";

export const generationModel = google("gemini-3.5-flash-lite");

export const embeddingModel = google.embedding("gemini-embedding-001");

/**
 * Gemini defaults to 3072 dimensions, but the `DocumentChunk.embedding`
 * column is `vector(1536)` and vector-store.ts rejects anything else.
 * Pass this to every `embed`/`embedMany` call so both sides agree.
 */
export const embeddingProviderOptions = { google: { outputDimensionality: 1536 } } as const;

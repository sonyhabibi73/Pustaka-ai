import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiError } from "@/lib/security/http";

describe("apiError status mapping", () => {
  const cases: [string, number][] = [
    ["UNAUTHENTICATED", 401],
    ["RATE_LIMITED", 429],
    ["DOCUMENT_NOT_READY_OR_NOT_FOUND", 404],
    ["INVALID_FILE_TYPE", 400],
    ["INVALID_YOUTUBE_URL", 400],
    ["THREAD_NOT_FOUND", 404],
  ];

  it.each(cases)("maps %s to %i", (code, status) => {
    const response = apiError(new Error(code));
    expect(response.status).toBe(status);
  });

  it("never leaks internal messages for unexpected failures", async () => {
    const response = apiError(new Error("PrismaClientKnownRequestError: connection refused"));
    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("Terjadi kesalahan pada server. Silakan coba lagi.");
    expect(body.error).not.toContain("Prisma");
    expect(body.error).not.toContain("connection");
  });

  it("handles non-Error values without crashing", async () => {
    const response = apiError("a string that escaped");
    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).not.toContain("a string that escaped");
  });

  it("sets no-store so failures are never cached", () => {
    const response = apiError(new Error("RATE_LIMITED"));
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects requests past the window in the in-memory fallback", async () => {
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");
    const id = `unit-test:${Math.random()}`;
    for (let i = 0; i < 3; i += 1) await enforceRateLimit(id, 3, "1 m");
    await expect(enforceRateLimit(id, 3, "1 m")).rejects.toThrow("RATE_LIMITED");
  });

  it("keeps counters separate per identifier", async () => {
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");
    const first = `unit-test-a:${Math.random()}`;
    const second = `unit-test-b:${Math.random()}`;
    await enforceRateLimit(first, 1, "1 m");
    await expect(enforceRateLimit(first, 1, "1 m")).rejects.toThrow("RATE_LIMITED");
    await expect(enforceRateLimit(second, 1, "1 m")).resolves.toBeTruthy();
  });

  it("fails closed in production when Upstash is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");
    await expect(enforceRateLimit("any", 30, "1 m")).rejects.toThrow(
      "RATE_LIMIT_CONFIGURATION_MISSING",
    );
  });
});

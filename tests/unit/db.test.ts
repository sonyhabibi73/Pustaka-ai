import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("prisma client singleton", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "");
    globalThis.prisma = undefined;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.prisma = undefined;
  });

  it("does not require DATABASE_URL just to import a route module", async () => {
    await expect(import("@/lib/db")).resolves.toHaveProperty("prisma");
  });

  it("reports missing configuration only when a query is attempted", async () => {
    const { prisma } = await import("@/lib/db");
    expect(() => prisma.user).toThrow("DATABASE_URL belum dikonfigurasi.");
  });

  it("reuses one client across imports instead of pooling per call", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/pelajari");
    const first = await import("@/lib/db");
    const second = await import("@/lib/db");
    expect(second.prisma).toBe(first.prisma);

    // Property access must resolve to the real instance, not the empty target.
    expect(typeof first.prisma.$transaction).toBe("function");
    expect(typeof second.prisma.user.findMany).toBe("function");
  });
});

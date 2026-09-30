import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const memoryWindows = new Map<string, { count: number; resetAt: number }>();

function localLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryWindows.get(identifier);
  if (!entry || entry.resetAt < now) {
    memoryWindows.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, reset: now + windowMs };
  }
  entry.count += 1;
  return { success: entry.count <= limit, reset: entry.resetAt };
}

export async function enforceRateLimit(
  identifier: string,
  limit: number,
  window: `${number} ${"s" | "m" | "h"}`,
) {
  const hasUpstash = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
  if (hasUpstash) {
    const limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: "pustaka-ai",
    });
    const result = await limiter.limit(identifier);
    if (!result.success) throw new Error("RATE_LIMITED");
    return result;
  }
  if (process.env.NODE_ENV === "production") throw new Error("RATE_LIMIT_CONFIGURATION_MISSING");
  const seconds =
    Number.parseInt(window, 10) *
    (window.endsWith("h") ? 3_600_000 : window.endsWith("m") ? 60_000 : 1_000);
  const result = localLimit(identifier, limit, seconds);
  if (!result.success) throw new Error("RATE_LIMITED");
  return result;
}

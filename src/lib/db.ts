import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum dikonfigurasi.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

function resolveClient() {
  const client = globalThis.prisma ?? createPrismaClient();
  if (!globalThis.prisma) globalThis.prisma = client;
  return client;
}

// Instantiated on first query rather than at import. `next build` collects page
// data by importing every route, so a client created eagerly would require a
// reachable DATABASE_URL just to produce a build.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = resolveClient();
    // Bound to the real instance: PrismaClient keeps state in private fields,
    // so a receiver of the proxy would break its field lookups.
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, property) {
    return Reflect.has(resolveClient(), property);
  },
  getPrototypeOf() {
    return Reflect.getPrototypeOf(resolveClient());
  },
});

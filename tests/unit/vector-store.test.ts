import { beforeEach, describe, expect, it, vi } from "vitest";

const executeRaw = vi.fn();
const queryRaw = vi.fn();

vi.mock("@/lib/db", () => ({ prisma: { $executeRaw: executeRaw, $queryRaw: queryRaw } }));

const { retrieveNearestChunks, saveEmbedding } = await import("@/lib/ai/vector-store");

beforeEach(() => {
  executeRaw.mockReset();
  queryRaw.mockReset();
});

function embedding(value = 0.25) {
  return Array.from({ length: 1536 }, () => value);
}

describe("retrieveNearestChunks", () => {
  it("binds documentId and distance as parameters instead of concatenating SQL", async () => {
    queryRaw.mockResolvedValueOnce([]);
    await retrieveNearestChunks("doc_1", embedding());

    const [sql] = queryRaw.mock.calls[0];
    expect(sql.values).toContain("doc_1");
    expect(sql.values.some((value: unknown) => typeof value === "number" && value > 1)).toBe(true);
    // The literal vector is bound as a parameter, never inlined into the statement text.
    expect(String(sql.strings.join("?"))).not.toContain("0.25,0.25");
  });

  it("clamps the LIMIT between 1 and 10", async () => {
    queryRaw.mockResolvedValue([]);
    await retrieveNearestChunks("doc_1", embedding(), 99);
    expect(queryRaw.mock.calls.at(-1)?.[0].values).toContain(10);

    await retrieveNearestChunks("doc_1", embedding(), -4);
    expect(queryRaw.mock.calls.at(-1)?.[0].values).toContain(1);
  });

  it("still filters on the owning document when a chunk id is absent", async () => {
    queryRaw.mockResolvedValueOnce([]);
    await retrieveNearestChunks("someone-elses-doc", embedding(), 6);
    const [sql] = queryRaw.mock.calls[0];
    expect(sql.strings.join("?")).toContain(`FROM "DocumentChunk"`);
    expect(sql.strings.join("?")).toContain(`"embedding" IS NOT NULL`);
    expect(sql.values).toContain("someone-elses-doc");
  });
});

describe("saveEmbedding", () => {
  it("writes the vector through a bound parameter", async () => {
    executeRaw.mockResolvedValueOnce(1);
    await saveEmbedding("chunk_1", embedding());
    const [sql] = executeRaw.mock.calls[0];
    expect(sql.values).toContain("chunk_1");
    expect(
      sql.values.some((value: unknown) => typeof value === "string" && value.startsWith("[")),
    ).toBe(true);
  });

  it("rejects an embedding that is not 1536 finite numbers", async () => {
    await expect(saveEmbedding("chunk_1", [0.1, 0.2])).rejects.toThrow("INVALID_EMBEDDING");
    await expect(saveEmbedding("chunk_1", embedding(Number.NaN))).rejects.toThrow(
      "INVALID_EMBEDDING",
    );
    expect(executeRaw).not.toHaveBeenCalled();
  });
});

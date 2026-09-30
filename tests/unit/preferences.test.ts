import { describe, expect, it } from "vitest";
import { CARD_BATCH_SIZES, DEFAULT_STUDY_PREFS, parseStudyPrefs } from "@/lib/study/preferences";

const DOC_ID = "cmumz6vy0000hlhp1sxwyxjyr";

describe("parseStudyPrefs", () => {
  it("falls back to defaults when the cookie is missing", () => {
    expect(parseStudyPrefs(undefined)).toEqual(DEFAULT_STUDY_PREFS);
    expect(parseStudyPrefs("")).toEqual(DEFAULT_STUDY_PREFS);
  });

  it("keeps valid values", () => {
    expect(parseStudyPrefs(JSON.stringify({ cardsPerSession: 48, defaultDocId: DOC_ID }))).toEqual({
      cardsPerSession: 48,
      defaultDocId: DOC_ID,
    });
  });

  it("rejects batch sizes outside the allowed list", () => {
    for (const size of [0, -5, 13, 999]) {
      const parsed = parseStudyPrefs(JSON.stringify({ cardsPerSession: size }));
      expect(parsed.cardsPerSession).toBe(DEFAULT_STUDY_PREFS.cardsPerSession);
    }
    expect(
      parseStudyPrefs(JSON.stringify({ cardsPerSession: CARD_BATCH_SIZES[0] })).cardsPerSession,
    ).toBe(CARD_BATCH_SIZES[0]);
  });

  it("drops a document id that does not look like a cuid", () => {
    expect(parseStudyPrefs(JSON.stringify({ defaultDocId: "../../etc/passwd" })).defaultDocId).toBe(
      null,
    );
    expect(parseStudyPrefs(JSON.stringify({ defaultDocId: 42 })).defaultDocId).toBeNull();
  });

  it("returns defaults instead of throwing on corrupt JSON", () => {
    expect(parseStudyPrefs("{oops")).toEqual(DEFAULT_STUDY_PREFS);
    expect(parseStudyPrefs("null")).toEqual(DEFAULT_STUDY_PREFS);
  });
});

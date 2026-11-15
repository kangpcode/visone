import { describe, expect, it } from "vitest";
import { PaginationQuerySchema, VISONE_BRAND, getMessages } from "./index";

describe("@visone/shared", () => {
  it("parses pagination defaults and clamps valid query params", () => {
    const parsed = PaginationQuerySchema.parse({});
    expect(parsed).toEqual({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
      includeDeleted: false,
    });
  });

  it("rejects out-of-range limit", () => {
    expect(() => PaginationQuerySchema.parse({ limit: 500 })).toThrow();
  });

  it("provides brand metadata and localized messages", () => {
    expect(VISONE_BRAND.name).toBe("VISONE");
    expect(getMessages("id").nav.dashboard).toBe("Dasbor");
    expect(getMessages("en").nav.dashboard).toBe("Dashboard");
  });
});

import { describe, test, expect } from "bun:test";

import { optional, string } from "../../src/type-system";

describe("optional as type", () => {
  test("should work", () => {
    const schema = optional(string());
    expect(schema.parse(undefined)).toBe(undefined);
    expect(schema.parse("test")).toBe("test");
  });
});

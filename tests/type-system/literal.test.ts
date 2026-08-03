import { describe, test, expect } from "bun:test";

import { literal } from "../../src/type-system";

describe("literal", () => {
  test("should parse valid literal", () => {
    for (const val of [
      "hello",
      123,
      true,
      undefined,
      null,
      false,
      NaN,
      { val: true },
      [123],
      -0,
    ]) {
      expect(literal(val).parse(val)).toBe(val);
    }
  });

  test("should throw error", () => {
    expect(() => literal("123").parse(" 123 ")).toThrow("Expected '123'");
    expect(() => literal(-0).parse(0)).toThrow("Expected '0'");
  });
});

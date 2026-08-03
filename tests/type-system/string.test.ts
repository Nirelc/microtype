import { describe, test, expect } from "bun:test";

import { string } from "../../src/type-system";

const schema = string();

describe("string", () => {
  test("should parse valid string", () => {
    expect(schema.parse("hello")).toBe("hello");
    expect(schema.parse(" hello ")).toBe(" hello ");
  });

  test("should throw error for not a string", () => {
    for (const invalidInput of [
      213,
      undefined,
      Infinity,
      NaN,
      null,
      true,
      {},
      [],
    ]) {
      expect(() => schema.parse(invalidInput)).toThrow("Expected string");
    }
  });
});

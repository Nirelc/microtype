import { describe, test, expect } from "bun:test";

import { float, number } from "../../src/type-system";

const schema = number();

describe("number", () => {
  test("should parse valid numbers", () => {
    expect(schema.parse(42)).toBe(42);
    expect(schema.parse(-10)).toBe(-10);
    expect(schema.parse(0)).toBe(0);
    expect(schema.parse(0.01)).toBe(0.01);

    const schemaWithCoerce = schema.coerce(true);
    expect(schemaWithCoerce.parse("123")).toBe(123);
    expect(schemaWithCoerce.parse("123.1")).toBe(123.1);
  });

  test("should throw error for invalid numbers", () => {
    for (const invalidInput of [
      "not a number",
      undefined,
      Infinity,
      NaN,
      null,
      true,
      {},
      [],
    ]) {
      expect(() => schema.parse(invalidInput)).toThrow("Expected number");
    }
  });

  test("float alias should works", () => {
    expect(float().parse(3.14)).toBe(3.14);
  });
});

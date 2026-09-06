import { describe, test, expect } from "bun:test";

import { boolean } from "../../src/type-system";

const schema = boolean();

describe("boolean", () => {
  test("should parse valid booleans", () => {
    expect(schema.parse(true)).toBe(true);
    expect(schema.parse(false)).toBe(false);

    const schemaWithCoerce = schema.coerce(true);
    expect(schemaWithCoerce.parse("true")).toBe(true);
    expect(schemaWithCoerce.parse("false")).toBe(false);
    expect(schemaWithCoerce.parse("TrUe")).toBe(true);
    expect(schemaWithCoerce.parse("FaLSE")).toBe(false);
    expect(schemaWithCoerce.parse("1")).toBe(true);
    expect(schemaWithCoerce.parse("0")).toBe(false);
    expect(schemaWithCoerce.parse(1)).toBe(true);
    expect(schemaWithCoerce.parse(0)).toBe(false);
  });

  test("should throw error for invalid boolean", () => {
    for (const invalidInput of [
      "not a number",
      undefined,
      Infinity,
      NaN,
      null,
      {},
      [],
      0,
      1,
      "yes",
    ]) {
      expect(() => schema.parse(invalidInput)).toThrow("Expected boolean");
    }

    const schemaWithCoerce = schema.coerce(true);
    for (const invalidInput of [
      "not a number",
      undefined,
      Infinity,
      NaN,
      null,
      {},
      [],
      100,
      -1,
      "yes",
    ]) {
      expect(() => schemaWithCoerce.parse(invalidInput)).toThrow(
        "Expected boolean",
      );
    }
  });
});

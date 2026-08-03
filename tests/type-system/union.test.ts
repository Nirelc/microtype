import { describe, expect, test } from "bun:test";

import {
  UnionValidationError,
  literal,
  number,
  union,
} from "../../src/type-system";

describe("union", () => {
  test("should parse a value accepted by any member", () => {
    const schema = union([literal("enabled"), number()]);

    expect(schema.parse("enabled")).toBe("enabled");
    expect(schema.parse(42)).toBe(42);
  });

  test("should support nested union", () => {
    const schema = union([
      literal("test"),
      union([
        literal("not"),
        literal(true),
        union([literal("42"), literal(42), literal(true)]),
      ]),
    ]);

    expect(schema.parse(true)).toBe(true);
  });

  test("should expose each member error when no member accepts the input", () => {
    const schema = union([literal("enabled"), number()]);

    let error: unknown;
    try {
      schema.parse(false);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(UnionValidationError);
    expect((error as UnionValidationError).errors).toHaveLength(2);
    expect((error as UnionValidationError).errors).toEqual([
      new Error("Expected 'enabled'"),
      new Error("Expected number"),
    ]);
  });
});

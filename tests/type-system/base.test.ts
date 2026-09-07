import { describe, test, expect } from "bun:test";
import { number } from "../../src/type-system/number";

describe("schema", () => {
  test("default should work", () => {
    const schema = number().default(42);
    expect(schema.parse(undefined)).toBe(42);
  });

  test("optional should work", () => {
    const schema = number().optional();

    expect(schema.parse(undefined)).toBe(undefined);
  });

  describe("transform", () => {
    const schema = number().transform((value) => value * 2);
    test("should work", () => {
      expect(schema.parse(21)).toBe(42);
    });

    test("should work with default", () => {
      const optionalSchema = schema.default(42);
      expect(optionalSchema.parse(undefined)).toBe(42);
      expect(optionalSchema.parse(21)).toBe(42);
    });

    test("should work with optional", () => {
      const optionalSchema = schema.optional();
      expect(optionalSchema.parse(undefined)).toBe(undefined);
      expect(optionalSchema.parse(21)).toBe(42);
    });

    test("should support type change", () => {
      const optionalSchema = number().transform((value) => value.toString());
      expect(optionalSchema.parse(21)).toBe("21");
    });

    test("should support nested transform", () => {
      const optionalSchema = number()
        .transform((value) => value.toString())
        .transform((value) => `Value: ${value}`);
      expect(optionalSchema.parse(21)).toBe(`Value: 21`);
    });
  });
});

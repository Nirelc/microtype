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
});

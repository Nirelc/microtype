import { describe, test, expect } from "bun:test";

import { transform, string } from "../../src/type-system";

describe("transform as type", () => {
  test("should work", () => {
    const schema = transform(string(), (value) =>
      ["yes", "true", "1", "on"].includes(value.toLowerCase()),
    );
    expect(schema.parse("yes")).toBe(true);
    expect(schema.parse("1")).toBe(true);
    expect(schema.parse("fghgfh")).toBe(false);
    expect(() => schema.parse(1)).toThrowError();
  });
});

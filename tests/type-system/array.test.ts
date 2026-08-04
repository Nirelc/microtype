import { describe, expect, test } from "bun:test";

import {
  array,
  literal,
  union,
  number,
  object,
  ValidationError,
} from "../../src/type-system";

const simpleSchema = array(number());

describe("array", () => {
  test("should parse a value accepted by any member", () => {
    const data: typeof simpleSchema.static = [0, -1, 3434];
    expect(simpleSchema.parse(data)).toEqual(data);
  });

  test("should parse with union", () => {
    const schema = array(union([literal("enabled"), number()]));
    const data: typeof schema.static = [0, -1, "enabled"];

    expect(schema.parse(data)).toEqual(data);
  });

  test("should parse with object", () => {
    const schema = array(
      object({
        value: number(),
      }),
    );
    const data: typeof schema.static = [
      {
        value: 1,
      },
      {
        value: 2,
      },
    ];

    expect(schema.parse(data)).toEqual(data);
  });

  test("should return error on invalid parse member", () => {
    let error: unknown;
    try {
      simpleSchema.parse([0, false]);
    } catch (err) {
      error = err;
    }

    expect(() => simpleSchema.parse(false)).toThrow("Expected array");
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).issues).toHaveLength(1);
    expect((error as ValidationError).issues).toEqual([
      { message: "Expected number", path: [1] },
    ]);
  });

  test("should return error if triggered min/max/length", () => {
    const schemaWithLength = array(number(), {
      length: 3,
    });

    expect(() => schemaWithLength.parse([1, 2, 3, 4])).toThrow(
      "Expected array with exactly 3 items",
    );
    expect(() => schemaWithLength.parse([1])).toThrow(
      "Expected array with exactly 3 items",
    );
    expect(() => schemaWithLength.parse([1, 1, 1])).not.toThrow();

    const schemaWithMinMax = array(number(), {
      min: 1,
      max: 2,
    });
    expect(() => schemaWithMinMax.parse([1, 2, 3])).toThrow(
      "Expected array with at most 2 items",
    );
    expect(() => schemaWithMinMax.parse([])).toThrow(
      "Expected array with at least 1 items",
    );
    expect(() => schemaWithMinMax.parse([1])).not.toThrow();
  });
});

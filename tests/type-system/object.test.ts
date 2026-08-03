import { describe, expect, test } from "bun:test";

import {
  literal,
  union,
  string,
  object,
  ObjectValidationError,
} from "../../src/type-system";

const schema = object({
  test: literal("passed"),
});

describe("object", () => {
  test("should parse a record", () => {
    expect(
      schema.parse({
        test: "passed",
        should: "strip",
      }),
    ).toEqual({
      test: "passed",
    });
  });

  test("should support nested objects", () => {
    const bigSchema = object({
      value: string().min(1),
      lib: union([literal("nirelc/microtype"), literal("valibot")]),
      nested: schema,
    });

    const data: typeof bigSchema.static = {
      value: "42",
      lib: "nirelc/microtype",
      nested: {
        test: "passed",
      },
    };
    expect(bigSchema.parse(data)).toEqual(data);
  });

  test("should return error on invalid data", () => {
    let error: unknown;
    try {
      schema.parse(new Date());
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(ObjectValidationError);
    expect((error as ObjectValidationError).errors).toHaveLength(1);
    expect((error as ObjectValidationError).errors[0]?.error).toEqual(
      new Error("Expected 'passed'"),
    );
  });
});

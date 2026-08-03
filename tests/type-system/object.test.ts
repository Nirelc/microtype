import { describe, expect, test } from "bun:test";

import {
  literal,
  union,
  string,
  object,
  ValidationError,
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

    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).issues).toHaveLength(1);
    expect((error as ValidationError).issues[0]?.message).toEqual(
      "Expected 'passed'",
    );
  });
});

import { describe, expect, test } from "bun:test";

import {
  literal,
  union,
  string,
  object,
  ValidationError,
  number,
  optional,
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

  test("should support optional fields", () => {
    const schemaWithOptional = object({
      value: string(),
      version: number().optional(),
      other: optional(string()),
    });

    expect(
      schemaWithOptional.parse({
        value: "42",
      }),
    ).toEqual({
      value: "42",
    });
  });

  test("should support default fields", () => {
    const schemaWithOptional = object({
      value: string(),
      version: number().default(1),
    });

    expect(
      schemaWithOptional.parse({
        value: "42",
      }),
    ).toEqual({
      value: "42",
      version: 1,
    });
  });

  test("should support transform fields", () => {
    const schemaWithOptional = object({
      value: string(),
      version: number()
        .default(1)
        .transform((value) => ({
          major: value,
          minor: 0,
        })),
    });

    expect(
      schemaWithOptional.parse({
        value: "42",
      }),
    ).toEqual({
      value: "42",
      version: {
        major: 1,
        minor: 0,
      },
    });
  });

  test("should support transform root", () => {
    const schemaWithOptional = object({
      value: string(),
      version: number().default(1),
    }).transform((value) => ({
      ...value,
      passed: true,
    }));

    expect(
      schemaWithOptional.parse({
        value: "42",
      }),
    ).toEqual({
      value: "42",
      version: 1,
      passed: true,
    });
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

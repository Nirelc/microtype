import { describe, test, expect } from "bun:test";

import {
  array,
  boolean,
  integer,
  literal,
  number,
  object,
  optional,
  string,
  transform,
  union,
  type Input,
  type Output,
  type StandardSchemaV1,
} from "../src";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type InferInput<S extends StandardSchemaV1> = StandardSchemaV1.InferInput<S>;
type InferOutput<S extends StandardSchemaV1> = StandardSchemaV1.InferOutput<S>;

function validate<S extends StandardSchemaV1>(
  schema: S,
  value: unknown,
): StandardSchemaV1.Result<InferOutput<S>> {
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) {
    throw new Error("Expected sync validation");
  }

  return result as StandardSchemaV1.Result<InferOutput<S>>;
}

describe("standard schema", () => {
  test("should expose version and vendor", () => {
    const props = string()["~standard"];
    expect(props.version).toBe(1);
    expect(props.vendor).toBe("microtype");
    expect(typeof props.validate).toBe("function");
  });

  test("should not add own property to schema instances", () => {
    expect(Object.hasOwn(string(), "~standard")).toBe(false);
  });

  test("should return value on success", () => {
    expect(validate(string(), "hello")).toEqual({ value: "hello" });
  });

  test("should return issues on failure", () => {
    expect(validate(string(), 1)).toEqual({
      issues: [{ message: "Expected string" }],
    });
  });

  test("should return transformed data", () => {
    const schema = string().transform((value) => value.length);
    expect(validate(schema, "abcd")).toEqual({ value: 4 });
  });

  test("should return default data", () => {
    const schema = number().default(42);
    expect(validate(schema, undefined)).toEqual({ value: 42 });
    expect(validate(schema, 1)).toEqual({ value: 1 });
  });

  test("should return nested paths for object in array", () => {
    const schema = array(object({ id: number(), tags: array(string()) }));
    const result = validate(schema, [
      { id: 1, tags: ["a"] },
      { id: "x", tags: ["a", 2] },
    ]);

    expect(result).toEqual({
      issues: [
        { message: "Expected number", path: [1, "id"] },
        { message: "Expected string", path: [1, "tags", 1] },
      ],
    });
  });

  describe("every schema kind", () => {
    test("string", () => {
      expect(validate(string(), "a")).toEqual({ value: "a" });
      expect(validate(string(), 1).issues).toHaveLength(1);
    });

    test("number", () => {
      expect(validate(number(), 1.5)).toEqual({ value: 1.5 });
      expect(validate(number().coerce(true), "2")).toEqual({ value: 2 });
      expect(validate(number(), "1").issues).toHaveLength(1);
    });

    test("integer", () => {
      expect(validate(integer(), 1)).toEqual({ value: 1 });
      expect(validate(integer(), 1.5).issues).toHaveLength(1);
    });

    test("boolean", () => {
      expect(validate(boolean(), true)).toEqual({ value: true });
      expect(validate(boolean().coerce(true), "false")).toEqual({
        value: false,
      });
      expect(validate(boolean(), "true").issues).toHaveLength(1);
    });

    test("literal", () => {
      expect(validate(literal("root"), "root")).toEqual({ value: "root" });
      expect(validate(literal("root"), "user").issues).toHaveLength(1);
    });

    test("union", () => {
      const schema = union([string(), number()]);
      expect(validate(schema, "a")).toEqual({ value: "a" });
      expect(validate(schema, 1)).toEqual({ value: 1 });
      expect(validate(schema, true).issues).toHaveLength(2);
    });

    test("array", () => {
      const schema = array(number()).min(1);
      expect(validate(schema, [1, 2])).toEqual({ value: [1, 2] });
      expect(validate(schema, []).issues).toHaveLength(1);
    });

    test("object", () => {
      const schema = object({ name: string(), age: number().optional() });
      expect(validate(schema, { name: "a" })).toEqual({
        value: { name: "a", age: undefined },
      });
      expect(validate(schema, { age: "x" })).toEqual({
        issues: [
          { message: "Expected string", path: ["name"] },
          { message: "Expected number", path: ["age"] },
        ],
      });
    });

    test("optional", () => {
      const schema = optional(string());
      expect(validate(schema, undefined)).toEqual({ value: undefined });
      expect(validate(schema, "a")).toEqual({ value: "a" });
      expect(validate(schema, 1).issues).toHaveLength(1);
    });

    test("default", () => {
      const schema = string().default("a");
      expect(validate(schema, undefined)).toEqual({ value: "a" });
      expect(validate(schema, 1).issues).toHaveLength(1);
    });

    test("transform", () => {
      const schema = transform(string(), (value) => value.toUpperCase());
      expect(validate(schema, "a")).toEqual({ value: "A" });
      expect(validate(schema, 1).issues).toHaveLength(1);
    });
  });
});

describe("standard schema types", () => {
  test("should infer input and output", () => {
    const transformSchema = string().transform((value) => value.length);
    const defaultSchema = number().default(1);
    const optionalSchema = string().optional();
    const objectSchema = object({
      id: number(),
      name: string().optional(),
      page: number().default(1),
      length: string().transform((value) => value.length),
    });
    const arraySchema = array(defaultSchema);
    const unionSchema = union([string(), transformSchema]);

    type Checks = [
      Expect<Equal<InferInput<typeof transformSchema>, string>>,
      Expect<Equal<InferOutput<typeof transformSchema>, number>>,
      Expect<Equal<InferInput<typeof defaultSchema>, number | undefined>>,
      Expect<Equal<InferOutput<typeof defaultSchema>, number>>,
      Expect<Equal<InferInput<typeof optionalSchema>, string | undefined>>,
      Expect<Equal<InferOutput<typeof optionalSchema>, string | undefined>>,
      Expect<
        Equal<
          InferInput<typeof objectSchema>,
          {
            readonly id: number;
            readonly name?: string | undefined;
            readonly page?: number | undefined;
            readonly length: string;
          }
        >
      >,
      Expect<
        Equal<
          InferOutput<typeof objectSchema>,
          {
            readonly id: number;
            readonly name?: string | undefined;
            readonly page: number;
            readonly length: number;
          }
        >
      >,
      Expect<Equal<InferInput<typeof arraySchema>, (number | undefined)[]>>,
      Expect<Equal<InferOutput<typeof arraySchema>, number[]>>,
      Expect<Equal<InferInput<typeof unionSchema>, string>>,
      Expect<Equal<InferOutput<typeof unionSchema>, string | number>>,
      Expect<Equal<Input<typeof objectSchema>, InferInput<typeof objectSchema>>>,
      Expect<Equal<Output<typeof objectSchema>, typeof objectSchema.static>>,
    ];

    const checks: Checks | undefined = undefined;
    expect(checks).toBeUndefined();
  });
});

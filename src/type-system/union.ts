import { BaseSchema, type Schema, type Static } from "./base";

export class UnionValidationError extends Error {
  constructor(readonly errors: Error[]) {
    super("Input doesn't match any union member");
    this.name = "UnionValidationError";
  }
}

export type UnionStatic<T extends readonly Schema[]> = Static<T[number]>;

export class UnionSchema<T extends Schema[]> extends BaseSchema<
  UnionStatic<T>
> {
  constructor(private readonly schemas: T) {
    super();
  }

  parse<I = unknown>(input: I): UnionStatic<T> {
    const errors: Error[] = [];

    for (const schema of this.schemas) {
      try {
        return schema.parse(input);
      } catch (err) {
        errors.push(err as Error);
      }
    }

    throw new UnionValidationError(errors);
  }
}

export function union<const T extends Schema[]>(schemas: T) {
  return new UnionSchema(schemas);
}

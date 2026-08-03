import { BaseSchema, type Schema } from "./base";
import { isRecord } from "../guards/object";

export class ObjectValidationError extends Error {
  constructor(readonly errors: ObjectErrorItem[]) {
    super("Object validation failed");
    this.name = "ObjectValidationError";
  }
}

export type ObjectErrorItem = {
  key: string;
  error: Error;
};
export type ObjectEntries = Record<string, Schema>;
export type ObjectStatic<T extends ObjectEntries> = {
  [K in keyof T]: T[K]["static"];
};

export class ObjectSchema<T extends ObjectEntries> extends BaseSchema<
  ObjectStatic<T>
> {
  constructor(private readonly entries: T) {
    super();
  }

  parse<I = unknown>(input: I): ObjectStatic<T> {
    const errors: ObjectErrorItem[] = [];
    if (!isRecord(input)) {
      throw new Error("Expected record");
    }

    const output: Record<string, unknown> = {};
    const requiredKeys = new Set(Object.keys(this.entries));
    for (const [key, schema] of Object.entries(this.entries)) {
      if (!requiredKeys.has(key)) {
        continue;
      }

      try {
        output[key] = schema.parse(input[key]);
      } catch (err) {
        errors.push({
          key,
          error: err as Error,
        } satisfies ObjectErrorItem);
      }
    }

    if (errors.length) {
      throw new ObjectValidationError(errors);
    }

    return output as ObjectStatic<T>;
  }
}

export function object<const T extends ObjectEntries>(entries: T) {
  return new ObjectSchema(entries);
}

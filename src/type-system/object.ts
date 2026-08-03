import { BaseSchema, type Schema, type ParseResult } from "./base";
import type { Issue } from "../utils/validation";
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

  _parse<I = unknown>(input: I): ParseResult<ObjectStatic<T>> {
    if (!isRecord(input)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected record",
          },
        ],
      };
    }

    const issues: Issue[] = [];
    const output: Record<string, unknown> = {};
    const requiredKeys = new Set(Object.keys(this.entries));
    for (const [key, schema] of Object.entries(this.entries)) {
      if (!requiredKeys.has(key)) {
        continue;
      }

      const result = schema._parse(input[key]);
      if (result.success) {
        output[key] = result.data;
        continue;
      }

      issues.push(
        ...result.issues.map((issue) => ({
          ...issue,
          path: [key, ...(issue.path ?? [])],
        })),
      );
    }

    if (issues.length) {
      return {
        success: false,
        issues,
      };
    }

    return {
      success: true,
      data: output as ObjectStatic<T>,
    };
  }
}

export function object<const T extends ObjectEntries>(entries: T) {
  return new ObjectSchema(entries);
}

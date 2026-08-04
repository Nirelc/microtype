import { BaseSchema, type Schema, type ParseResult } from "./base";
import type { Issue } from "../utils/validation";
import { isRecord } from "../guards/object";

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
    for (const key in this.entries) {
      const result = this.entries[key]!._parse(input[key]);
      if (result.success) {
        output[key] = result.data;
        continue;
      }

      for (let i = 0; i < result.issues.length; i++) {
        const issue = result.issues[i]!;
        if (issue.path) {
          issue.path.unshift(key);
        } else {
          issue.path = [key];
        }
        issues.push(issue);
      }
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

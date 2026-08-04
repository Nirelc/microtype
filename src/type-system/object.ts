import {
  BaseSchema,
  type Schema,
  type ParseResult,
  type OptionalSchema,
} from "./base";
import type { Issue } from "../utils/validation";
import { isRecord } from "../guards/object";

export type ObjectErrorItem = {
  key: string;
  error: Error;
};
export type ObjectEntries = Record<string, Schema>;

type Simplify<T> = {
  [K in keyof T]: T[K];
};
export type ObjectStatic<T extends ObjectEntries> = Simplify<
  {
    [
      K in keyof T as T[K] extends OptionalSchema<any> ? never : K
    ]-?: T[K]["static"];
  } & {
    [
      K in keyof T as T[K] extends OptionalSchema<any> ? K : never
    ]?: T[K]["static"];
  }
>;

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

    let issues: Issue[] | undefined;
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
        (issues ??= []).push(issue);
      }
    }

    if (issues?.length) {
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

export function object<const T extends ObjectEntries>(
  entries: T,
): ObjectSchema<T> {
  return new ObjectSchema(entries);
}

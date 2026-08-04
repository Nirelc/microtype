import { BaseSchema, type Schema, type Static, type ParseResult } from "./base";
import type { Issue } from "../utils/validation";

export type UnionStatic<T extends readonly Schema[]> = Static<T[number]>;

export class UnionSchema<T extends Schema[]> extends BaseSchema<
  UnionStatic<T>
> {
  constructor(private readonly schemas: T) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<UnionStatic<T>> {
    const issues: Issue[] = [];

    for (const schema of this.schemas) {
      const result = schema._parse(input);
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }

      issues.push(...result.issues);
    }

    return {
      success: false,
      issues,
    };
  }
}

export function union<const T extends Schema[]>(schemas: T) {
  return new UnionSchema(schemas);
}

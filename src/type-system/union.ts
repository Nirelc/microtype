import {
  BaseSchema,
  type Schema,
  type Static,
  type Input,
  type ParseResult,
} from "./base";
import type { Issue } from "../utils/validation";

export type UnionStatic<T extends readonly Schema[]> = Static<T[number]>;
export type UnionInput<T extends readonly Schema[]> = Input<T[number]>;

export class UnionSchema<T extends Schema[]> extends BaseSchema<
  UnionStatic<T>,
  UnionInput<T>
> {
  constructor(private readonly schemas: T) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<UnionStatic<T>> {
    const issues: Issue[] | undefined = [];

    for (const schema of this.schemas) {
      const result = schema._parse(input);
      if (result.success) {
        return result;
      }

      issues.push(...result.issues);
    }

    return {
      success: false,
      issues,
    };
  }
}

export function union<const T extends Schema[]>(schemas: T): UnionSchema<T> {
  return new UnionSchema(schemas);
}

import { BaseSchema, type ParseResult } from "./base";

export class LiteralSchema<T> extends BaseSchema<T> {
  constructor(private readonly expected: T) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<T> {
    if (Object.is(input, this.expected)) {
      return { success: true, data: this.expected };
    }

    return {
      success: false,
      issues: [
        {
          message: `Expected '${this.expected}'`,
        },
      ],
    };
  }
}

export function literal<const T>(expected: T): LiteralSchema<T> {
  return new LiteralSchema<T>(expected);
}

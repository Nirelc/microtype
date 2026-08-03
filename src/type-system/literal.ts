import { BaseSchema } from "./base";

export class LiteralSchema<T> extends BaseSchema<T> {
  constructor(private readonly expected: T) {
    super();
  }

  parse<I = unknown>(input: I): T {
    if (Object.is(input, this.expected)) {
      return this.expected;
    }

    throw new Error(`Expected '${this.expected}'`);
  }
}

export function literal<const T>(expected: T) {
  return new LiteralSchema<T>(expected);
}

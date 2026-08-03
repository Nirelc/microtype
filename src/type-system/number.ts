import { BaseSchema } from "./base";

export type NumberOptions = {
  min?: number;
  max?: number;
  coerce?: boolean;
  default?: number;
  integer?: boolean;
};

export class NumberSchema extends BaseSchema<number> {
  constructor(private readonly opts: NumberOptions = {}) {
    super();
  }

  parse<I = unknown>(input: I): number {
    let value: unknown = input;
    if (typeof value === "string" && this.opts.coerce) {
      value = Number(value);
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Expected number");
    }

    if (this.opts.integer && !Number.isInteger(value)) {
      throw new Error("Expected integer");
    }

    if (this.opts.min !== undefined && value < this.opts.min) {
      throw new Error(`Must be >= ${this.opts.min}`);
    }

    if (this.opts.max !== undefined && value > this.opts.max) {
      throw new Error(`Must be <= ${this.opts.max}`);
    }

    return value;
  }

  max(max: number): NumberSchema {
    return new NumberSchema({ ...this.opts, max });
  }

  min(min: number): NumberSchema {
    return new NumberSchema({ ...this.opts, min });
  }

  coerce(coerce: boolean): NumberSchema {
    return new NumberSchema({ ...this.opts, coerce });
  }

  integer() {
    return new NumberSchema({
      ...this.opts,
      integer: true,
    });
  }
}

export function number(opts: NumberOptions = {}) {
  return new NumberSchema(opts);
}

export function float() {
  return number();
}

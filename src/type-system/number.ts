import { BaseSchema, type ParseResult } from "./base";

export type NumberOptions = {
  min?: number;
  max?: number;
  coerce?: boolean;
  integer?: boolean;
};

export class NumberSchema extends BaseSchema<number> {
  constructor(private readonly opts: NumberOptions = {}) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<number> {
    let data: unknown = input;
    if (typeof data === "string" && this.opts.coerce) {
      data = Number(data);
    }

    if (typeof data !== "number" || !Number.isFinite(data)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected number",
          },
        ],
      };
    }

    if (this.opts.integer && !Number.isInteger(data)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected integer",
          },
        ],
      };
    }

    if (this.opts.min !== undefined && data < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Must be >= ${this.opts.min}`,
          },
        ],
      };
    }

    if (this.opts.max !== undefined && data > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Must be <= ${this.opts.max}`,
          },
        ],
      };
    }

    return { success: true, data };
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

  integer(): NumberSchema {
    return new NumberSchema({
      ...this.opts,
      integer: true,
    });
  }
}

export function number(opts: NumberOptions = {}): NumberSchema {
  return new NumberSchema(opts);
}

export function float(): NumberSchema {
  return number();
}

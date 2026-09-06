import { BaseSchema, type ParseResult } from "./base";

export type StringOptions = {
  min?: number;
  max?: number;
};

export class StringSchema extends BaseSchema<string> {
  constructor(private readonly opts: StringOptions = {}) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<string> {
    if (typeof input !== "string") {
      return {
        success: false,
        issues: [
          {
            message: "Expected string",
          },
        ],
      };
    }

    const len = input.length;
    if (this.opts.min !== undefined && len < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Must be >= ${this.opts.min}`,
          },
        ],
      };
    }

    if (this.opts.max !== undefined && len > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Must be <= ${this.opts.max}`,
          },
        ],
      };
    }

    return { success: true, data: input };
  }

  max(max: number): StringSchema {
    return new StringSchema({ ...this.opts, max });
  }

  min(min: number): StringSchema {
    return new StringSchema({ ...this.opts, min });
  }
}

export function string(opts: StringOptions = {}): StringSchema {
  return new StringSchema(opts);
}

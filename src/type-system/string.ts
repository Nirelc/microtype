import { BaseSchema, type ParseResult } from "./base";

export type StringOptions = {
  min?: number;
  max?: number;
  default?: string;
};

export class StringSchema extends BaseSchema<string> {
  constructor(private readonly opts: StringOptions = {}) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<string> {
    let data = input;
    if (typeof data !== "string") {
      return {
        success: false,
        issues: [
          {
            message: "Expected string",
          },
        ],
      };
    }

    const len = data.length;
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

    return { success: true, data };
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

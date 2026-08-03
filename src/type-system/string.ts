import { BaseSchema } from "./base";

export type StringOptions = {
  min?: number;
  max?: number;
  default?: string;
};

export class StringSchema extends BaseSchema<string> {
  constructor(private readonly opts: StringOptions = {}) {
    super();
  }

  parse<I = unknown>(input: I): string {
    let value = input;
    if (typeof value !== "string") {
      throw new Error("Expected string");
    }

    const len = value.length;
    if (this.opts.min !== undefined && len < this.opts.min) {
      throw new Error(`Must be >= ${this.opts.min}`);
    }

    if (this.opts.max !== undefined && len > this.opts.max) {
      throw new Error(`Must be <= ${this.opts.max}`);
    }

    return value;
  }

  max(max: number): StringSchema {
    return new StringSchema({ ...this.opts, max });
  }

  min(min: number): StringSchema {
    return new StringSchema({ ...this.opts, min });
  }
}

export function string(opts: StringOptions = {}) {
  return new StringSchema(opts);
}

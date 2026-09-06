import { BaseSchema, type ParseResult } from "./base";

export type BooleanOptions = {
  coerce?: boolean;
};

export class BooleanSchema extends BaseSchema<boolean> {
  constructor(private readonly opts: BooleanOptions = {}) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<boolean> {
    if (typeof input === "boolean") {
      return { success: true, data: input };
    }

    if (this.opts.coerce) {
      if (typeof input === "string") {
        if (input === "true" || input === "1") {
          return { success: true, data: true };
        }

        if (input === "false" || input === "0") {
          return { success: true, data: false };
        }

        // if fastpath isn't hit
        const lowerData = input.toLowerCase();
        if (lowerData === "true") {
          return { success: true, data: true };
        }

        if (lowerData === "false") {
          return { success: true, data: false };
        }
      }

      if (typeof input === "number") {
        if (input === 1) {
          return { success: true, data: true };
        }

        if (input === 0) {
          return { success: true, data: false };
        }
      }
    }

    return {
      success: false,
      issues: [
        {
          message: "Expected boolean",
        },
      ],
    };
  }

  coerce(coerce: boolean): BooleanSchema {
    return new BooleanSchema({ ...this.opts, coerce });
  }
}

export function boolean(opts: BooleanOptions = {}): BooleanSchema {
  return new BooleanSchema(opts);
}

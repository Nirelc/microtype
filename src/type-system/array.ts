import { BaseSchema, type Schema, type Static, type ParseResult } from "./base";
import type { Issue } from "../utils/validation";

export class ArrayValidationError extends Error {
  constructor(readonly errors: Error[]) {
    super("Array validation failed");
    this.name = "ArrayValidationError";
  }
}

export type ArrayOptions = {
  min?: number;
  max?: number;
  length?: number;
};

export type ArrayStatic<T extends Schema> = Static<T>[];

export class ArraySchema<T extends Schema> extends BaseSchema<ArrayStatic<T>> {
  constructor(
    private readonly item: T,
    private readonly opts: ArrayOptions = {},
  ) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<ArrayStatic<T>> {
    if (!Array.isArray(input)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected array",
          },
        ],
      };
    }

    const len = input.length;
    if (this.opts.length !== undefined && len !== this.opts.length) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with exactly ${this.opts.length} items`,
          },
        ],
      };
    }

    if (this.opts.min !== undefined && len < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with at least ${this.opts.min} items`,
          },
        ],
      };
    }

    if (this.opts.max !== undefined && len > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with at most ${this.opts.max} items`,
          },
        ],
      };
    }

    const output: ArrayStatic<T> = [];
    const issues: Issue[] = [];
    for (const idx in input) {
      const result = this.item._parse(input[idx]);
      if (result.success) {
        output.push(result.data);
        continue;
      }

      issues.push(
        ...result.issues.map((issue) => ({
          ...issue,
          path: [idx, ...(issue.path ?? [])],
        })),
      );
    }

    if (issues.length) {
      return {
        success: false,
        issues,
      };
    }

    return {
      success: true,
      data: output,
    };
  }

  length(length: number): ArraySchema<T> {
    return new ArraySchema(this.item, { ...this.opts, length });
  }

  min(min: number): ArraySchema<T> {
    return new ArraySchema(this.item, { ...this.opts, min });
  }

  max(max: number): ArraySchema<T> {
    return new ArraySchema(this.item, { ...this.opts, max });
  }
}

export function array<const T extends Schema>(
  item: T,
  opts: ArrayOptions = {},
) {
  return new ArraySchema(item, opts);
}

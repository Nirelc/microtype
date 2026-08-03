import { BaseSchema, type Schema, type Static } from "./base";

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

  parse<I = unknown>(input: I): ArrayStatic<T> {
    if (!Array.isArray(input)) {
      throw new Error("Expected array");
    }

    const len = input.length;
    if (this.opts.length !== undefined && len !== this.opts.length) {
      throw new Error(`Expected array with exactly ${this.opts.length} items`);
    }

    if (this.opts.min !== undefined && len < this.opts.min) {
      throw new Error(`Expected array with at least ${this.opts.min} items`);
    }

    if (this.opts.max !== undefined && len > this.opts.max) {
      throw new Error(`Expected array with at most ${this.opts.max} items`);
    }

    const output: ArrayStatic<T> = [];
    const errors: Error[] = [];
    for (const val of input) {
      try {
        output.push(this.item.parse(val));
      } catch (err) {
        errors.push(err as Error);
      }
    }

    if (errors.length) {
      throw new ArrayValidationError(errors);
    }

    return output;
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

import { type Issue, formatValidationMessage } from "../utils/validation";

export type ParseResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      issues: Issue[];
    };

export class ValidationError extends Error {
  constructor(readonly issues: Issue[]) {
    super(formatValidationMessage(issues));
    this.name = "ValidationError";
  }
}

export interface Schema<T = unknown> {
  readonly static: T;
  parse<I = unknown>(input: I): T;
  _parse<I = unknown>(input: I): ParseResult<T>;
}

export type Static<T extends Schema> = T["static"];
export type TransformFn<T = unknown, O = unknown> = (value: T) => O;

export abstract class BaseSchema<T> implements Schema<T> {
  declare readonly static: T;
  abstract _parse<I = unknown>(input: I): ParseResult<T>;

  parse<I = unknown>(input: I): T {
    const result = this._parse<I>(input);
    if (result.success) {
      return result.data;
    }

    throw new ValidationError(result.issues);
  }

  optional(): OptionalSchema<T> {
    return new OptionalSchema(this);
  }

  default(value: Exclude<T, undefined>): DefaultSchema<T> {
    return new DefaultSchema(this, value);
  }

  transform<O>(transformFn: TransformFn<T, O>): TransformSchema<T, O> {
    return new TransformSchema(this, transformFn);
  }
}

export class OptionalSchema<T> extends BaseSchema<T | undefined> {
  constructor(private readonly inner: Schema<T>) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<T | undefined> {
    if (input === undefined) {
      return { success: true, data: undefined };
    }

    return this.inner._parse<I>(input);
  }
}

export type DefaultValue<T> = Exclude<T, undefined>;
export class DefaultSchema<T> extends BaseSchema<DefaultValue<T>> {
  constructor(
    private readonly inner: Schema<T>,
    private readonly defaultValue: DefaultValue<T>,
  ) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<DefaultValue<T>> {
    if (input === undefined) {
      return { success: true, data: this.defaultValue };
    }

    return this.inner._parse(input) as ParseResult<DefaultValue<T>>;
  }
}

export class TransformSchema<T, O> extends BaseSchema<O> {
  constructor(
    private readonly inner: Schema<T>,
    private readonly transformFn: TransformFn<T, O>,
  ) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<O> {
    const data = this.inner._parse(input);
    if (!data.success) {
      return data;
    }

    return {
      success: true,
      data: this.transformFn(data.data),
    };
  }
}

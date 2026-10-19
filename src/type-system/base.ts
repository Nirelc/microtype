import type { StandardSchemaV1 } from "../standard-schema";
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

export interface Schema<Output = unknown, Input = Output> extends StandardSchemaV1<Input, Output> {
  readonly static: Output;
  parse<I = unknown>(input: I): Output;
  _parse<I = unknown>(input: I): ParseResult<Output>;
}

export type Static<T extends Schema> = T["static"];
export type Output<T extends Schema> = Static<T>;
export type Input<T extends Schema> = StandardSchemaV1.InferInput<T>;
export type TransformFn<T = unknown, O = unknown> = (value: T) => O;

export abstract class BaseSchema<Output, Input = Output> implements Schema<Output, Input> {
  declare readonly static: Output;
  abstract _parse<I = unknown>(input: I): ParseResult<Output>;

  get "~standard"(): StandardSchemaV1.Props<Input, Output> {
    return {
      version: 1,
      vendor: "microtype",
      validate: (value) => {
        const result = this._parse(value);
        return result.success ? { value: result.data } : { issues: result.issues };
      },
    };
  }

  parse<I = unknown>(input: I): Output {
    const result = this._parse<I>(input);
    if (result.success) {
      return result.data;
    }

    throw new ValidationError(result.issues);
  }

  optional(): OptionalSchema<Output, Input> {
    return new OptionalSchema(this);
  }

  default(value: Exclude<Output, undefined>): DefaultSchema<Output, Input> {
    return new DefaultSchema(this, value);
  }

  transform<O>(transformFn: TransformFn<Output, O>): TransformSchema<Output, O, Input> {
    return new TransformSchema(this, transformFn);
  }
}

export class OptionalSchema<Output, Input = Output> extends BaseSchema<
  Output | undefined,
  Input | undefined
> {
  constructor(private readonly inner: Schema<Output, Input>) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<Output | undefined> {
    if (input === undefined) {
      return { success: true, data: undefined };
    }

    return this.inner._parse<I>(input);
  }
}

export type DefaultValue<T> = Exclude<T, undefined>;
export class DefaultSchema<Output, Input = Output> extends BaseSchema<
  DefaultValue<Output>,
  Input | undefined
> {
  constructor(
    private readonly inner: Schema<Output, Input>,
    private readonly defaultValue: DefaultValue<Output>,
  ) {
    super();
  }

  _parse<I = unknown>(input: I): ParseResult<DefaultValue<Output>> {
    if (input === undefined) {
      return { success: true, data: this.defaultValue };
    }

    return this.inner._parse(input) as ParseResult<DefaultValue<Output>>;
  }
}

export class TransformSchema<T, O, Input = T> extends BaseSchema<O, Input> {
  constructor(
    private readonly inner: Schema<T, Input>,
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

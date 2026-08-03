export interface Schema<T = unknown> {
  readonly static: T;
  parse<I = unknown>(input: I): T;
}

export type Static<T extends Schema> = T["static"];

export abstract class BaseSchema<T> implements Schema<T> {
  declare readonly static: T;
  abstract parse<I = unknown>(input: I): T;

  optional() {
    return new OptionalSchema(this);
  }

  default(value: Exclude<T, undefined>): DefaultSchema<T> {
    return new DefaultSchema(this, value);
  }
}

export class OptionalSchema<T> extends BaseSchema<T | undefined> {
  constructor(private readonly inner: Schema<T>) {
    super();
  }

  parse<I = unknown>(input: I): T | undefined {
    if (input === undefined) {
      return undefined;
    }

    return this.inner.parse(input);
  }
}

export class DefaultSchema<T> extends BaseSchema<Exclude<T, undefined>> {
  constructor(
    private readonly inner: Schema<T>,
    private readonly defaultValue: Exclude<T, undefined>,
  ) {
    super();
  }

  parse<I = unknown>(input: I): Exclude<T, undefined> {
    if (input === undefined) {
      return this.defaultValue;
    }

    return this.inner.parse(input) as Exclude<T, undefined>;
  }
}

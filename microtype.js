// src/type-system/base.ts
class BaseSchema {
  optional() {
    return new OptionalSchema(this);
  }
  default(value) {
    return new DefaultSchema(this, value);
  }
}

class OptionalSchema extends BaseSchema {
  inner;
  constructor(inner) {
    super();
    this.inner = inner;
  }
  parse(input) {
    if (input === undefined) {
      return;
    }
    return this.inner.parse(input);
  }
}

class DefaultSchema extends BaseSchema {
  inner;
  defaultValue;
  constructor(inner, defaultValue) {
    super();
    this.inner = inner;
    this.defaultValue = defaultValue;
  }
  parse(input) {
    if (input === undefined) {
      return this.defaultValue;
    }
    return this.inner.parse(input);
  }
}

// src/type-system/number.ts
class NumberSchema extends BaseSchema {
  opts;
  constructor(opts = {}) {
    super();
    this.opts = opts;
  }
  parse(input) {
    let value = input;
    if (typeof value === "string" && this.opts.coerce) {
      value = Number(value);
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Expected number");
    }
    if (this.opts.integer && !Number.isInteger(value)) {
      throw new Error("Expected integer");
    }
    if (this.opts.min !== undefined && value < this.opts.min) {
      throw new Error(`Must be >= ${this.opts.min}`);
    }
    if (this.opts.max !== undefined && value > this.opts.max) {
      throw new Error(`Must be <= ${this.opts.max}`);
    }
    return value;
  }
  max(max) {
    return new NumberSchema({ ...this.opts, max });
  }
  min(min) {
    return new NumberSchema({ ...this.opts, min });
  }
  coerce(coerce) {
    return new NumberSchema({ ...this.opts, coerce });
  }
  integer() {
    return new NumberSchema({
      ...this.opts,
      integer: true
    });
  }
}
function number(opts = {}) {
  return new NumberSchema(opts);
}
// src/type-system/string.ts
class StringSchema extends BaseSchema {
  opts;
  constructor(opts = {}) {
    super();
    this.opts = opts;
  }
  parse(input) {
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
  max(max) {
    return new StringSchema({ ...this.opts, max });
  }
  min(min) {
    return new StringSchema({ ...this.opts, min });
  }
}
function string(opts = {}) {
  return new StringSchema(opts);
}
// src/type-system/literal.ts
class LiteralSchema extends BaseSchema {
  expected;
  constructor(expected) {
    super();
    this.expected = expected;
  }
  parse(input) {
    if (Object.is(input, this.expected)) {
      return this.expected;
    }
    throw new Error(`Expected '${this.expected}'`);
  }
}
function literal(expected) {
  return new LiteralSchema(expected);
}
// src/type-system/union.ts
class UnionValidationError extends Error {
  errors;
  constructor(errors) {
    super("Input doesn't match any union member");
    this.errors = errors;
    this.name = "UnionValidationError";
  }
}

class UnionSchema extends BaseSchema {
  schemas;
  constructor(schemas) {
    super();
    this.schemas = schemas;
  }
  parse(input) {
    const errors = [];
    for (const schema of this.schemas) {
      try {
        return schema.parse(input);
      } catch (err) {
        errors.push(err);
      }
    }
    throw new UnionValidationError(errors);
  }
}
function union(schemas) {
  return new UnionSchema(schemas);
}
// src/guards/object.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/type-system/object.ts
class ObjectValidationError extends Error {
  errors;
  constructor(errors) {
    super("Object validation failed");
    this.errors = errors;
    this.name = "ObjectValidationError";
  }
}

class ObjectSchema extends BaseSchema {
  entries;
  constructor(entries) {
    super();
    this.entries = entries;
  }
  parse(input) {
    const errors = [];
    if (!isRecord(input)) {
      throw new Error("Expected record");
    }
    const output = {};
    const requiredKeys = new Set(Object.keys(this.entries));
    for (const [key, schema] of Object.entries(this.entries)) {
      if (!requiredKeys.has(key)) {
        continue;
      }
      try {
        output[key] = schema.parse(input[key]);
      } catch (err) {
        errors.push({
          key,
          error: err
        });
      }
    }
    if (errors.length) {
      throw new ObjectValidationError(errors);
    }
    return output;
  }
}
function object(entries) {
  return new ObjectSchema(entries);
}
// src/type-system/array.ts
class ArrayValidationError extends Error {
  errors;
  constructor(errors) {
    super("Array validation failed");
    this.errors = errors;
    this.name = "ArrayValidationError";
  }
}

class ArraySchema extends BaseSchema {
  item;
  opts;
  constructor(item, opts = {}) {
    super();
    this.item = item;
    this.opts = opts;
  }
  parse(input) {
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
    const output = [];
    const errors = [];
    for (const val of input) {
      try {
        output.push(this.item.parse(val));
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length) {
      throw new ArrayValidationError(errors);
    }
    return output;
  }
  length(length) {
    return new ArraySchema(this.item, { ...this.opts, length });
  }
  min(min) {
    return new ArraySchema(this.item, { ...this.opts, min });
  }
  max(max) {
    return new ArraySchema(this.item, { ...this.opts, max });
  }
}
function array(item, opts = {}) {
  return new ArraySchema(item, opts);
}
// microtype.ts
var LoginSchema = object({
  name: string(),
  platform: union([literal("android"), literal("ios")]),
  versions: array(union([string(), number()])).optional(),
  minVer: number().min(0).max(3)
});
var t = LoginSchema.parse({
  name: "jong doe",
  platform: "ios",
  versions: [1, 2, 3],
  minVer: 6
});
console.log(t);

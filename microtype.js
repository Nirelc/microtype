// src/utils/validation.ts
function formatPath(path) {
  let result = "";
  for (const segment of path) {
    if (typeof segment === "number") {
      result += `[${segment}]`;
    } else if (typeof segment === "string" && /^[A-Za-z_$][\w$]*$/.test(segment)) {
      result += result ? `.${segment}` : segment;
    } else {
      result += `[${JSON.stringify(segment)}]`;
    }
  }
  return result;
}
function formatIssue(issue) {
  const path = formatPath(issue.path ?? []);
  return path ? `${path}: ${issue.message}` : issue.message;
}
function formatValidationMessage(issues) {
  if (issues.length === 0) {
    return "Validation failed";
  }
  if (issues.length === 1) {
    return `Validation failed: ${formatIssue(issues[0])}`;
  }
  const details = issues.map((issue) => `  - ${formatIssue(issue)}`).join(`
`);
  return `Validation failed with ${issues.length} issues:
${details}`;
}

// src/type-system/base.ts
class ValidationError extends Error {
  issues;
  constructor(issues) {
    super(formatValidationMessage(issues));
    this.issues = issues;
    this.name = "ValidationError";
  }
}

class BaseSchema {
  parse(input) {
    const result = this._parse(input);
    if (result.success) {
      return result.data;
    }
    throw new ValidationError(result.issues);
  }
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
  _parse(input) {
    if (input === undefined) {
      return { success: true, data: undefined };
    }
    return this.inner._parse(input);
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
  _parse(input) {
    if (input === undefined) {
      return { success: true, data: this.defaultValue };
    }
    return this.inner._parse(input);
  }
}

// src/type-system/number.ts
class NumberSchema extends BaseSchema {
  opts;
  constructor(opts = {}) {
    super();
    this.opts = opts;
  }
  _parse(input) {
    let data = input;
    if (typeof data === "string" && this.opts.coerce) {
      data = Number(data);
    }
    if (typeof data !== "number" || !Number.isFinite(data)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected number"
          }
        ]
      };
    }
    if (this.opts.integer && !Number.isInteger(data)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected integer"
          }
        ]
      };
    }
    if (this.opts.min !== undefined && data < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Must be >= ${this.opts.min}`
          }
        ]
      };
    }
    if (this.opts.max !== undefined && data > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Must be <= ${this.opts.max}`
          }
        ]
      };
    }
    return { success: true, data };
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
  _parse(input) {
    let data = input;
    if (typeof data !== "string") {
      return {
        success: false,
        issues: [
          {
            message: "Expected string"
          }
        ]
      };
    }
    const len = data.length;
    if (this.opts.min !== undefined && len < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Must be >= ${this.opts.min}`
          }
        ]
      };
    }
    if (this.opts.max !== undefined && len > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Must be <= ${this.opts.max}`
          }
        ]
      };
    }
    return { success: true, data };
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
  _parse(input) {
    if (Object.is(input, this.expected)) {
      return { success: true, data: this.expected };
    }
    return {
      success: false,
      issues: [
        {
          message: `Expected '${this.expected}'`
        }
      ]
    };
  }
}
function literal(expected) {
  return new LiteralSchema(expected);
}
// src/type-system/union.ts
class UnionSchema extends BaseSchema {
  schemas;
  constructor(schemas) {
    super();
    this.schemas = schemas;
  }
  _parse(input) {
    const issues = [];
    for (const schema of this.schemas) {
      const result = schema._parse(input);
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      }
      issues.push(...result.issues);
    }
    return {
      success: false,
      issues
    };
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
class ObjectSchema extends BaseSchema {
  entries;
  constructor(entries) {
    super();
    this.entries = entries;
  }
  _parse(input) {
    if (!isRecord(input)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected record"
          }
        ]
      };
    }
    const issues = [];
    const output = {};
    for (const key in this.entries) {
      const result = this.entries[key]._parse(input[key]);
      if (result.success) {
        output[key] = result.data;
        continue;
      }
      issues.push(...result.issues.map((issue) => ({
        ...issue,
        path: [key, ...issue.path ?? []]
      })));
    }
    if (issues.length) {
      return {
        success: false,
        issues
      };
    }
    return {
      success: true,
      data: output
    };
  }
}
function object(entries) {
  return new ObjectSchema(entries);
}
// src/type-system/array.ts
class ArraySchema extends BaseSchema {
  item;
  opts;
  constructor(item, opts = {}) {
    super();
    this.item = item;
    this.opts = opts;
  }
  _parse(input) {
    if (!Array.isArray(input)) {
      return {
        success: false,
        issues: [
          {
            message: "Expected array"
          }
        ]
      };
    }
    const len = input.length;
    if (this.opts.length !== undefined && len !== this.opts.length) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with exactly ${this.opts.length} items`
          }
        ]
      };
    }
    if (this.opts.min !== undefined && len < this.opts.min) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with at least ${this.opts.min} items`
          }
        ]
      };
    }
    if (this.opts.max !== undefined && len > this.opts.max) {
      return {
        success: false,
        issues: [
          {
            message: `Expected array with at most ${this.opts.max} items`
          }
        ]
      };
    }
    const output = [];
    const issues = [];
    for (let idx = 0;idx < input.length; idx++) {
      const result = this.item._parse(input[idx]);
      if (result.success) {
        output.push(result.data);
        continue;
      }
      issues.push(...result.issues.map((issue) => ({
        ...issue,
        path: [idx, ...issue.path ?? []]
      })));
    }
    if (issues.length) {
      return {
        success: false,
        issues
      };
    }
    return {
      success: true,
      data: output
    };
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
  minVer: 3
});
console.log(t);

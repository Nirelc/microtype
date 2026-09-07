# microtype

Super lightweight and simple type system library like zod, but faster, smaller, and with fewer functions.

We doesn't use `eval`, `Function` or something like this, because we're staying web-friendly

## Install

NPM

```bash
npm install @nirelc/microtype
```

Bun

```bash
bun intall @nirelc/microtype
```

## Usage

### Imports

Microtype can be imported with wildcard or with only required types

```ts
// with only required types import
import { … } from '@nirelc/microtype';

// with a wildcard import
import * as t from '@nirelc/microtype';
```

### Your first type

Microtype simillar with valibot and other type system libs, because of this, you will easily understand our syntax

```ts
import { object, string } from "@nirelc/microtype";

// typescript
type UserData = {
  username: string;
  email?: string;
};

// microtype
const PostSchema = object({
  username: string(),
  email: string().optional(),
});

type PostData = typeof PostSchema.static;

const data = PostSchema.parse({
  username: "system",
  should: "strip",
});
```

We provide some useful features with schema chaining

```ts
const PostSchema = object({
  email: string().min(5).max(128).optional(),
  version: number().default(1),
});
```

## API

All types support `<type>.default(<value>)` syntax.

Now we support these types:

### String

```ts
// typescript
type Username = string;

// microtype
const UsernameSchema = string();

// extra fields
const UsernameExtraSchema = string().min(1).max(24).default("root");
```

### Numbers

```ts
// typescript
type Version = number;

// microtype
// any number and floats
const VersionSchema = number(); // or `float()` as alias

// only integer (float will trigger error)
const VersionIntSchema = integer();

// integer with pre-built validators
// supports: uinteger, u8, u16, u32, i8, i16, i32
const SmallVersionSchema = u8();

// extra fields
// e.g value should equals 1 <= value <= 3 and should parse string as number and drop float support
const VersionExtraSchema = number().min(1).max(3).coerce(true).integer(true);
```

### Literal

```ts
// typescript
type Username = "root";

// microtype
const UsernameSchema = literal("root");
```

### Boolean

```ts
// typescript
type IsActive = boolean;

// microtype
const IsActiveSchema = boolean();

// coerce string and number to boolean
const IsActiveCoerceSchema = boolean().coerce(true);
```

### Optional

Supported separated type `optional(<schema>)`, also can be chained with `<schema>.optional()`

```ts
// typescript
type Email = string | undefined;

const EmailSchema = string().optional();
// const EmailSchema = optional(string());
```

### Transform

Supported separated type `transform(<schema>, <TransformFn>)`, also can be chained with `<schema>.transform(<transformFn>)`.

```ts
const StrBoolSchema = string().transform((value) =>
  ["yes", "true", "1", "on"].includes(value.toLowerCase()),
);
// const StrBoolSchema = transform(string(), (value) =>
//   ["yes", "true", "1", "on"].includes(value.toLowerCase()),
// );
```

### Unions

```ts
// typescript
type Username = "root" | "user";

// microtype
const UsernameSchema = union([literal("root"), literal("user")];

// with nested union
const UsernameWithNestedSchema = union([literal("root"), union([literal("user")])])
```

### Arrays

```ts
// typescript
type Versions = number[];

// microtype
const VersionsSchema = array(number());

// extra fields
// min 1 item, max 3 items
const VersionsLimitedSchema = array(number()).min(1).max(3);

// array.length should be equal 3
const VersionsWithLengthScheam = array(number()).length(3);
```

### Objects

All unknown fields will be deleted

```ts
// typescript
type User = {
  username: string;
  email?: string;
  status: "banned" | "active";
};

// microtype
const VersionsSchema = object({
  username: string(),
  // email: string().optional()
  email: optional(string()),
  status: union([literal("banned"), literal("active")]),
});
```

## Benchmarks

You can run benchmarks in [bench](./bench) dir.

### Results

In this benchmark, we compare microtype with other popular type system libraries: valibot, arktype, typebox, and zod.

The results below are from the best of 5 runs for Microtype.

#### Schema creation + parse

Create a new schema and parse 1000 values

| name            |    median |
| --------------- | --------: |
| _**microtype**_ | 593.57 µs |
| valibot         |   4.48 ms |
| typebox         |  16.09 ms |
| arktype         |  70.64 ms |
| zod             |  82.26 ms |

#### Global schema

Global schema (parsing with pre-created schema) with parse 1000 values

| name                   |    median |
| ---------------------- | --------: |
| _typebox [compiled]\*_ |  21.04 µs |
| arktype\*              |  46.64 µs |
| **microtype**          | 423.31 µs |
| valibot                | 522.05 µs |
| zod                    | 615.21 µs |
| typebox                |   9.85 ms |

\* - `arktype` and `typebox [compiled]` uses precompile, because of this, it has better performance for global schema

#### Bundle size

We using [a micro test case](./bench/size) for create a type object schema + parse for all libs

| name            | unminified |  minified |     gzip |
| --------------- | ---------: | --------: | -------: |
| _**microtype**_ |    10.5 KB |   5.42 KB |   1.5 KB |
| valibot         |   13.79 KB |   6.06 KB |  1.97 KB |
| typebox         |  119.01 KB |  52.88 KB | 14.65 KB |
| zod             |  158.92 KB |  83.35 KB | 23.12 KB |
| arktype         |  280.74 KB | 153.44 KB | 46.68 KB |

## Why

Q: Why did you make another type system lib?

- idk, just for fun

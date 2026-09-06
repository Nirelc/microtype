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

// const EmailSchema = string().optional()
const EmailSchema = optional(string());
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

#### Cold start

Cold start (create a new schema and parse it)

| name            | avg       |
| --------------- | --------- |
| _**microtype**_ | 649.81 µs |
| valibot         | 3.23 ms   |
| typebox         | 18.34 ms  |
| arktype         | 47.28 ms  |
| zod             | 94.78 ms  |

#### Global schema

Global schema (parsing with pre-created schema)

| name                   | avg       |
| ---------------------- | --------- |
| _typebox [compiled]\*_ | 22.19 µs  |
| arktype\*              | 35.63 µs  |
| **microtype**          | 382.47 µs |
| valibot                | 434.18 µs |
| zod                    | 426.60 µs |
| typebox                | 6.26 ms   |

\* - `arktype` and `typebox [compiled]` uses precompile, because of this, it has better performance for global schema

#### Bundle size

We using [a micro test case](./bench/size) for create a type object schema + parse for all libs

| name            | avg       |
| --------------- | --------- |
| _**microtype**_ | 9.02 KB   |
| valibot         | 13.69 KB  |
| zod             | 138.03 KB |
| arktype         | 281.49 KB |
| typebox         | 358.11 KB |

## Why

Q: Why did you make another type system lib?

- idk, just for fun

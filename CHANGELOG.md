# 0.0.4

Every schema now implements `StandardSchemaV1` via the `~standard` property, so it can be used directly in Elysia, tRPC, Hono, TanStack Form, react-hook-form, etc.

- Added [Standard Schema](https://standardschema.dev) v1 support
- Schemas now track an input type separately from the output type (`Schema<Output, Input>`, `BaseSchema<Output, Input>`)
- Added `Input<S>` and `Output<S>` helper types (`Output` is an alias of `Static`) and exported the `StandardSchemaV1` type

# 0.0.3

- Added `.transform(<transformFn>)` method and `transform(<schema>, <transformFn>)` type to transform schema values to a different type
- Updated benchmark logic:
  - Added gzip, minimized size bench.
  - Now shows median of 5 results instead of avg from best of N run for microtype

# 0.0.2

- Added support for `t.boolean()` schema type
- Removed unused `default` field from `NumberOptions` and `StringOptions`

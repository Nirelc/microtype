# 0.0.3

- Added `.transform(<transformFn>)` method and `transform(<schema>, <transformFn>)` type to transform schema values to a different type
- Updated benchmark logic:
  - Added gzip, minimized size bench.
  - Now shows median of 5 results instead of avg from best of N run for microtype

# 0.0.2

- Added support for `t.boolean()` schema type
- Removed unused `default` field from `NumberOptions` and `StringOptions`

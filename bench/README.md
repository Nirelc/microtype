```bash
Median of 5 runs; each iteration parses 1000 values.

#### Schema creation + parse

| name | median |
| --- | ---: |
| _**microtype**_ | 595.65 µs |
| valibot | 2.30 ms |
| typebox | 12.17 ms |
| zod | 67.36 ms |
| arktype | 94.95 ms |

#### Global schema

| name | median |
| --- | ---: |
| _typebox [compiled]\*_ | 19.20 µs |
| arktype\* | 37.36 µs |
| **microtype** | 366.14 µs |
| zod | 505.66 µs |
| valibot | 533.27 µs |
| typebox | 7.25 ms |
```

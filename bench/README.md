```bash
Median of 5 runs; each iteration parses 1000 values.

#### Schema creation + parse

| name | median |
| --- | ---: |
| _**microtype**_ | 593.57 µs |
| valibot | 4.48 ms |
| typebox | 16.09 ms |
| arktype | 70.64 ms |
| zod | 82.26 ms |

#### Global schema

| name | median |
| --- | ---: |
| _typebox [compiled]\*_ | 21.04 µs |
| arktype\* | 46.64 µs |
| **microtype** | 423.31 µs |
| valibot | 522.05 µs |
| zod | 615.21 µs |
| typebox | 9.85 ms
```

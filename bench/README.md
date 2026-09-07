```bash
bun index.js
clk: ~1.83 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.4.2 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
microtype [cold]             521.39 µs/iter 495.20 µs ██
                      (385.10 µs … 2.61 ms)   2.01 ms ██
                    (  0.00  b …   2.48 mb)  38.73 kb ███▃▂▂▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁

microtype [global]           337.07 µs/iter 335.50 µs █
                      (269.60 µs … 1.99 ms)   1.38 ms █▇
                    (  0.00  b … 972.00 kb)  13.86 kb ██▅▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

valibot [cold]                 3.83 ms/iter   4.35 ms  ▄██▂▂
                        (2.55 ms … 6.64 ms)   6.45 ms  █████▅▃
                    (  0.00  b …   4.76 mb) 135.80 kb █████████▆▄▃█▅▃▇█▃▄▃▄

valibot [global]             495.82 µs/iter 478.70 µs █
                      (399.50 µs … 2.17 ms)   1.76 ms █▅
                    (  0.00  b …  68.00 kb)  69.92  b ██▆▃▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold]                49.39 ms/iter  52.07 ms           █        █
                      (44.90 ms … 54.27 ms)  52.54 ms ▅ ▅ ▅  ▅  █  ▅     █▅
                    (348.00 kb …  26.65 mb)   6.68 mb █▁█▁█▁▁█▁▁█▁▁█▁▁▁▁▁██

arktype [global]              39.54 µs/iter  41.30 µs █
                     (31.60 µs … 476.70 µs)  96.30 µs █
                    (  0.00  b …  32.00 kb)   2.39  b █▅▂▄▃▃▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁

typebox [cold]                16.85 ms/iter  18.67 ms █ ██ █ █  █ █
                      (12.72 ms … 23.38 ms)  22.59 ms ██████ █  ███ █ █ █
                    (  0.00  b …  12.15 mb)   1.74 mb ████████▁██████▁█▁█▁█

typebox [global]               7.54 ms/iter   7.87 ms  █▂▆
                       (6.61 ms … 10.39 ms)   9.42 ms  ████▅ ▅▅
                    (  0.00  b …   4.90 mb) 216.13 kb ██████▅████▇▇▁▃▅▁▃▅▅▇

typebox [compiled][global]    25.41 µs/iter  24.00 µs ▃█▂
                       (15.10 µs … 2.89 ms) 106.00 µs ███
                    (  0.00  b …  92.00 kb) 113.18  b ███▆▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

zod [cold]                    82.37 ms/iter  85.86 ms █ █        █
                     (64.26 ms … 124.78 ms) 104.09 ms █ █▅    ▅▅ █ ▅      ▅
                    (  4.00 kb …  16.83 mb)   3.67 mb █▁██▁▁▁▁██▁█▁█▁▁▁▁▁▁█

zod [global]                 666.84 µs/iter 718.60 µs █▅▅
                      (379.90 µs … 3.16 ms)   2.46 ms ███▃
                    (  0.00  b …   1.98 mb)  11.40 kb █████▅▄▃▃▁▂▁▁▁▁▁▁▁▁▁▁

                             ┌                                            ┐
                             ┬╷
            microtype [cold] │┤
                             ┴╵
                             ┬╷
          microtype [global] │┤
                             ┴╵
                              ┌┬╷
              valibot [cold]  ││┤
                              └┴╵
                             ┬╷
            valibot [global] │┤
                             ┴╵
                                                ╷┌┬─┐
              arktype [cold]                    ├┤│ │
                                                ╵└┴─┘
                             ┬
            arktype [global] │
                             ┴
                                  ╷┌┬┐ ╷
              typebox [cold]      ├┤│├─┤
                                  ╵└┴┘ ╵
                                ┬╷
            typebox [global]    │┤
                                ┴╵
                             ┬
  typebox [compiled][global] │
                             ┴
                                                         ╷ ┌─────┬┐       ╷
                  zod [cold]                             ├─┤     │├───────┤
                                                         ╵ └─────┴┘       ╵
                             ┬╷
                zod [global] │┤
                             ┴╵
                             └                                            ┘
                             15.10 µs          52.05 ms           104.09 ms

summary
  typebox [compiled][global]
   1.56x faster than arktype [global]
   13.26x faster than microtype [global]
   19.51x faster than valibot [global]
   20.52x faster than microtype [cold]
   26.24x faster than zod [global]
   150.74x faster than valibot [cold]
   296.83x faster than typebox [global]
   663.06x faster than typebox [cold]
   1943.24x faster than arktype [cold]
   3241.12x faster than zod [cold]
```

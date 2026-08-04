```bash
bun index.js
clk: ~1.31 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.3.14 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
microtype [cold]             649.81 µs/iter 577.90 µs █
                      (494.10 µs … 3.22 ms)   2.65 ms █
                    (  0.00  b …   3.32 mb)  53.99 kb ██▃▁▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

microtype [global]           382.47 µs/iter 354.70 µs █
                      (332.10 µs … 2.69 ms)   2.01 ms █
                    (  0.00  b …  72.00 kb) 223.17  b █▃▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

valibot [cold]                 3.23 ms/iter   3.37 ms  █
                        (2.51 ms … 6.25 ms)   5.89 ms  █▅
                    (  0.00  b …   1.74 mb)  58.75 kb ▆██▇▇▄▅▂▂▂▂▂▂▂▁▁▁▂▂▂▃

valibot [global]             434.18 µs/iter 405.00 µs █
                      (359.30 µs … 2.72 ms)   2.27 ms █
                    (  0.00  b … 184.00 kb) 570.10  b █▆▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold]                47.28 ms/iter  47.34 ms █   █   █
                      (44.07 ms … 53.92 ms)  52.26 ms █  ▅█ ▅ █▅          ▅
                    (572.00 kb …  18.90 mb)   5.40 mb █▁▁██▁█▁██▁▁▁▁▁▁▁▁▁▁█

arktype [global]              35.63 µs/iter  34.50 µs █
                      (33.60 µs … 97.50 µs)  62.10 µs █
                    (  0.00  b …  36.00 kb)  49.43  b █▇▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

typebox [cold]                18.34 ms/iter  18.54 ms  █
                      (15.56 ms … 26.97 ms)  26.74 ms ▇█▇
                    (  0.00  b …  19.22 mb)   3.14 mb ███▃▁▆▃▆▁▁▁▁▁▁▁▁▁▃▃▆▃

typebox [global]               6.26 ms/iter   6.33 ms  █
                        (5.65 ms … 9.04 ms)   8.86 ms ▇█▅
                    (  0.00  b … 360.00 kb)  16.26 kb ███▅▅▄▂▂▄▁▁▂▂▁▂▁▂▂▂▁▂

typebox [compiled][global]    22.19 µs/iter  20.70 µs ▂█
                       (19.30 µs … 2.22 ms)  40.10 µs ██
                    (  0.00  b … 132.00 kb) 208.20  b ██▃▂▁▄▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁

zod [cold]                    94.78 ms/iter  95.43 ms     █
                     (88.44 ms … 102.70 ms) 102.59 ms     █     █
                    ( 32.00 kb …   4.39 mb)   1.36 mb █▁▁██▁▁▁███▁▁▁▁█▁▁▁▁█

zod [global]                 426.60 µs/iter 389.50 µs █
                      (324.10 µs … 2.94 ms)   2.44 ms █
                    (  0.00  b …   2.38 mb)  10.51 kb ██▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

                             ┌                                            ┐
                             ┬╷
            microtype [cold] │┤
                             ┴╵
                             ┬╷
          microtype [global] │┤
                             ┴╵
                              ┬ ╷
              valibot [cold]  │─┤
                              ┴ ╵
                             ┬╷
            valibot [global] │┤
                             ┴╵
                                                ╷┌┬ ╷
              arktype [cold]                    ├┤│─┤
                                                ╵└┴ ╵
                             ┬
            arktype [global] │
                             ┴
                                    ┌┬   ╷
              typebox [cold]        ││───┤
                                    └┴   ╵
                               ╷┬╷
            typebox [global]   ├│┤
                               ╵┴╵
                             ┬
  typebox [compiled][global] │
                             ┴
                                                                    ╷┌─┬  ╷
                  zod [cold]                                        ├┤ │──┤
                                                                    ╵└─┴  ╵
                             ┬╷
                zod [global] │┤
                             ┴╵
                             └                                            ┘
                             19.30 µs          51.31 ms           102.59 ms

summary
  typebox [compiled][global]
   1.61x faster than arktype [global]
   17.24x faster than microtype [global]
   19.23x faster than zod [global]
   19.57x faster than valibot [global]
   29.29x faster than microtype [cold]
   145.49x faster than valibot [cold]
   282.13x faster than typebox [global]
   826.74x faster than typebox [cold]
   2131.12x faster than arktype [cold]
   4271.98x faster than zod [cold]
```

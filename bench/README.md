```bash
bun bench/index.js
clk: ~1.96 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.3.14 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
microtype [cold]             666.48 µs/iter 598.80 µs █
                      (514.80 µs … 3.14 ms)   2.59 ms █▇
                    (  0.00  b …   3.80 mb)  52.77 kb ██▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

microtype [global]           400.75 µs/iter 375.20 µs █
                      (349.10 µs … 2.46 ms)   2.02 ms █
                    (  0.00  b … 296.00 kb) 679.91  b █▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

valibot [cold]                 3.21 ms/iter   3.26 ms  █▆
                        (2.61 ms … 6.16 ms)   5.77 ms ▂██
                    (  0.00  b …   1.91 mb)  52.25 kb ███▆▆▅▄▃▂▂▂▂▁▁▁▁▁▃▂▃▁

valibot [global]             447.83 µs/iter 438.80 µs █▇
                      (335.70 µs … 2.70 ms)   2.26 ms ██
                    (  0.00  b … 136.00 kb) 345.95  b ██▆▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold]                52.20 ms/iter  55.12 ms      █
                      (46.16 ms … 58.28 ms)  57.00 ms ▅   ▅█ ▅     ▅   ▅▅ ▅
                    (200.00 kb …  15.01 mb)   4.06 mb █▁▁▁██▁█▁▁▁▁▁█▁▁▁██▁█

arktype [global]              35.38 µs/iter  34.70 µs  █
                     (33.50 µs … 104.70 µs)  51.70 µs  █
                    (  0.00  b …  52.00 kb)  42.97  b ▂█▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

                             ┌                                            ┐
                             ┬ ╷
            microtype [cold] │─┤
                             ┴ ╵
                             ┬ ╷
          microtype [global] │─┤
                             ┴ ╵
                               ┌┬ ╷
              valibot [cold]   ││─┤
                               └┴ ╵
                             ┬ ╷
            valibot [global] │─┤
                             ┴ ╵
                                                                 ╷ ┌──┬──┐╷
              arktype [cold]                                     ├─┤  │  ├┤
                                                                 ╵ └──┴──┘╵
                             ┬
            arktype [global] │
                             ┴
                             └                                            ┘
                             33.50 µs           28.52 ms           57.00 ms

summary
  arktype [global]
   11.33x faster than microtype [global]
   12.66x faster than valibot [global]
   18.84x faster than microtype [cold]
   90.81x faster than valibot [cold]
   1475.48x faster than arktype [cold]
```

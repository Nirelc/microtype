```bash
bun bench/index.js
clk: ~1.96 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.3.14 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
microtype [cold]             751.27 µs/iter 675.00 µs █
                      (565.40 µs … 3.14 ms)   2.83 ms █▆
                    (  0.00  b …   4.42 mb)  59.85 kb ██▄▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

microtype [global]           473.97 µs/iter 438.80 µs █
                      (391.70 µs … 2.79 ms)   2.32 ms █
                    (  0.00  b … 272.00 kb) 589.53  b █▇▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

valibot [cold]                 3.30 ms/iter   3.43 ms  █
                        (2.65 ms … 6.41 ms)   6.01 ms  █▆
                    (  0.00  b …   1.94 mb)  51.94 kb ▆██▇▄▄▃▄▃▂▂▁▁▁▂▂▁▃▂▂▁

valibot [global]             442.01 µs/iter 420.70 µs █
                      (352.80 µs … 2.72 ms)   2.27 ms █▂
                    (  0.00  b … 456.00 kb) 913.70  b ██▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold]                50.97 ms/iter  51.68 ms            █ █
                      (47.44 ms … 54.00 ms)  53.93 ms ▅▅       ▅▅█ █      ▅
                    (  1.33 mb …   9.99 mb)   4.08 mb ██▁▁▁▁▁▁▁███▁█▁▁▁▁▁▁█

arktype [global]              36.86 µs/iter  35.60 µs  █
                     (34.10 µs … 120.90 µs)  61.90 µs  █
                    (  0.00  b …  64.00 kb)  42.04  b ▃█▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

                             ┌                                            ┐
                             ┌┬╷
            microtype [cold] ││┤
                             └┴╵
                             ┬ ╷
          microtype [global] │─┤
                             ┴ ╵
                               ┌┬ ╷
              valibot [cold]   ││─┤
                               └┴ ╵
                             ┬ ╷
            valibot [global] │─┤
                             ┴ ╵
                                                                     ╷ ┌┬ ╷
              arktype [cold]                                         ├─┤│─┤
                                                                     ╵ └┴ ╵
                             ┬
            arktype [global] │
                             ┴
                             └                                            ┘
                             34.10 µs           26.98 ms           53.93 ms

summary
  arktype [global]
   11.99x faster than valibot [global]
   12.86x faster than microtype [global]
   20.38x faster than microtype [cold]
   89.52x faster than valibot [cold]
   1382.54x faster than arktype [cold]
```

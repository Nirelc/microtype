```bash
bun bench/index.js
clk: ~1.93 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.3.14 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
microtype [cold]               1.88 ms/iter   1.86 ms  █
                        (1.54 ms … 4.93 ms)   4.11 ms ██
                    (  0.00  b …   5.93 mb) 158.58 kb ██▇▅▄▂▂▁▁▁▁▁▁▂▂▂▂▁▁▁▁

microtype [global]             1.38 ms/iter   1.34 ms █
                        (1.23 ms … 3.47 ms)   3.14 ms ██
                    (  0.00  b … 156.00 kb) 868.35  b ██▆▄▂▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁

valibot [cold]                 3.25 ms/iter   3.26 ms  █
                        (2.67 ms … 6.00 ms)   5.78 ms  █▇
                    (  0.00  b …   1.95 mb)  56.81 kb ▇██▇▄▃▄▂▃▂▁▂▁▂▁▁▂▃▃▁▁

valibot [global]             476.91 µs/iter 455.90 µs █
                      (392.70 µs … 2.70 ms)   2.19 ms █▄
                    (  0.00  b … 472.00 kb) 946.53  b ██▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold]                47.32 ms/iter  47.34 ms      ██
                      (43.40 ms … 52.25 ms)  51.96 ms ▅   ▅██ ▅▅      ▅   ▅
                    (728.00 kb …  12.89 mb)   4.20 mb █▁▁▁███▁██▁▁▁▁▁▁█▁▁▁█

arktype [global]              46.29 µs/iter  45.70 µs  █
                     (43.30 µs … 136.30 µs)  70.60 µs  █▂
                    (  0.00  b … 116.00 kb)  65.97  b ▃██▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁

                             ┌                                            ┐
                              ┌┬ ╷
            microtype [cold]  ││─┤
                              └┴ ╵
                              ┬ ╷
          microtype [global]  │─┤
                              ┴ ╵
                               ┌┬ ╷
              valibot [cold]   ││─┤
                               └┴ ╵
                             ┬ ╷
            valibot [global] │─┤
                             ┴ ╵
                                                                   ╷ ┌┬   ╷
              arktype [cold]                                       ├─┤│───┤
                                                                   ╵ └┴   ╵
                             ┬
            arktype [global] │
                             ┴
                             └                                            ┘
                             43.30 µs           26.00 ms           51.96 ms

summary
  arktype [global]
   10.3x faster than valibot [global]
   29.79x faster than microtype [global]
   40.66x faster than microtype [cold]
   70.22x faster than valibot [cold]
   1022.09x faster than arktype [cold]
```

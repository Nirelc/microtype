```bash
bun bench/index.js
clk: ~1.97 GHz
cpu: AMD Ryzen 7 PRO 3700 8-Core Processor
runtime: bun 1.3.14 (x64-win32)

benchmark avg (min … max) p75 / p99 (min … top 1%)

---

microtype [cold] 5.30 ms/iter 5.43 ms █
(4.69 ms … 7.36 ms) 7.29 ms ▇█▇
( 0.00 b … 8.25 mb) 661.92 kb ▄████▆▅▄▄▂▄▂▂▁▁▂▂▃▂▁▂

microtype [global] 4.70 ms/iter 4.77 ms █▇
(4.22 ms … 6.44 ms) 6.17 ms ▂█ ██
( 0.00 b … 2.34 mb) 168.48 kb ▅█████▇▆█▄▆▂▁▃▁▁▁▁▁▁▃

valibot [cold] 3.17 ms/iter 3.23 ms █
(2.53 ms … 6.31 ms) 5.68 ms ▂██
( 0.00 b … 5.98 mb) 93.71 kb ███▇▆▅▃▂▂▂▁▁▁▂▁▂▂▁▃▂▃

valibot [global] 475.48 µs/iter 462.40 µs █▃
(361.20 µs … 2.89 ms) 2.28 ms ██
( 0.00 b … 256.00 kb) 946.74 b ██▅▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

arktype [cold] 55.43 ms/iter 58.12 ms █ ██ ██ █ ██
(50.78 ms … 64.74 ms) 58.62 ms █ ██ ██ █ ██
(336.00 kb … 12.50 mb) 3.78 mb █▁██▁▁▁██▁▁▁▁▁█▁▁▁▁██

arktype [global] 38.21 µs/iter 40.50 µs █
(31.80 µs … 148.60 µs) 67.00 µs █ █
( 0.00 b … 16.00 kb) 48.14 b ██▁▂▁█▂▂▂▂▁▂▁▂▂▂▂▁▁▁▁

                             ┌                                            ┐
                                 ┬ ╷
            microtype [cold]     │─┤
                                 ┴ ╵
                                ┌┬╷
          microtype [global]    ││┤
                                └┴╵
                               ┬ ╷
              valibot [cold]   │─┤
                               ┴ ╵
                             ┬ ╷
            valibot [global] │─┤
                             ┴ ╵
                                                                    ╷┌──┬─┐
              arktype [cold]                                        ├┤  │ │
                                                                    ╵└──┴─┘
                             ┬
            arktype [global] │
                             ┴
                             └                                            ┘
                             31.80 µs           29.33 ms           58.62 ms

summary
arktype [global]
12.45x faster than valibot [global]
83.06x faster than valibot [cold]
123.09x faster than microtype [global]
138.69x faster than microtype [cold]
1450.97x faster than arktype [cold]
```

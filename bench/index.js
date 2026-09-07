import { measure, do_not_optimize } from "mitata";

import * as mt from "../dist/type-system";
import * as v from "valibot";
import * as z from "zod";
import { type } from "arktype";
import tb from "typebox";
import TBSchema from "typebox/schema";

const data = Array.from({ length: 1000 }).map(() => ({
  name: crypto.randomUUID(),
  platform: "ios",
  versions: [1, crypto.randomUUID()],
  minVer: 1,
}));

function microtypeSchemaAndParse(val) {
  const LoginSchema = mt.object({
    name: mt.string(),
    platform: mt.union([mt.literal("android"), mt.literal("ios")]),
    versions: mt.array(mt.union([mt.string(), mt.number()])).optional(),
    minVer: mt.number().min(0).max(3),
  });

  return LoginSchema.parse(val);
}

function valibotSchemaAndParse(val) {
  const LoginSchema = v.object({
    name: v.string(),
    platform: v.union([v.literal("android"), v.literal("ios")]),
    versions: v.optional(v.array(v.union([v.string(), v.number()]))),
    minVer: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
  });

  return v.parse(LoginSchema, val);
}

function arktypeSchemaAndParse(val) {
  const LoginSchema = type({
    name: "string",
    platform: "'android' | 'ios'",
    "versions?": "(number | string)[]",
    minVer: "0 <= number <= 3",
  });

  return LoginSchema(val);
}

function typeboxSchemaAndParse(val) {
  const LoginSchema = tb.Object({
    name: tb.String(),
    platform: tb.Union([tb.Literal("android"), tb.Literal("ios")]),
    versions: tb.Optional(tb.Array(tb.Union([tb.String(), tb.Number()]))),
    minVer: tb.Number({
      minimum: 0,
      maximum: 3,
    }),
  });

  return TBSchema.Parse(LoginSchema, val);
}

function zodSchemaAndParse(val) {
  const LoginSchema = z.object({
    name: z.string(),
    platform: z.union([z.literal("android"), z.literal("ios")]),
    versions: z.array(z.union([z.string(), z.number()])).optional(),
    minVer: z.number().min(0).max(3),
  });

  return LoginSchema.parse(val);
}

const MTLoginSchemaGlobal = mt.object({
  name: mt.string(),
  platform: mt.union([mt.literal("android"), mt.literal("ios")]),
  versions: mt.array(mt.union([mt.string(), mt.number()])).optional(),
  minVer: mt.number().min(0).max(3),
});

const VBLoginSchemaGlobal = v.object({
  name: v.string(),
  platform: v.union([v.literal("android"), v.literal("ios")]),
  versions: v.optional(v.array(v.union([v.string(), v.number()]))),
  minVer: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
});

const ATLoginSchemaGlobal = type({
  name: "string",
  platform: "'android' | 'ios'",
  "versions?": "(number | string)[]",
  minVer: "0 <= number <= 3",
});

const TBLoginSchemaGlobal = tb.Object({
  name: tb.String(),
  platform: tb.Union([tb.Literal("android"), tb.Literal("ios")]),
  versions: tb.Optional(tb.Array(tb.Union([tb.String(), tb.Number()]))),
  minVer: tb.Number({
    minimum: 0,
    maximum: 3,
  }),
});

const TBLoginSchemaCompiledGlobal = TBSchema.Compile(TBLoginSchemaGlobal);

const ZLoginSchemaGlobal = z.object({
  name: z.string(),
  platform: z.union([z.literal("android"), z.literal("ios")]),
  versions: z.array(z.union([z.string(), z.number()])).optional(),
  minVer: z.number().min(0).max(3),
});

function microtypeWithGlobal(val) {
  return MTLoginSchemaGlobal.parse(val);
}

function valibotWithGlobal(val) {
  return v.parse(VBLoginSchemaGlobal, val);
}

function arktypeWithGlobal(val) {
  return ATLoginSchemaGlobal(val);
}

function typeboxWithGlobal(val) {
  return TBSchema.Parse(TBLoginSchemaGlobal, val);
}

function typeboxWithCompiledGlobal(val) {
  return TBLoginSchemaCompiledGlobal.Parse(val);
}

function zodWithGlobal(val) {
  return ZLoginSchemaGlobal.parse(val);
}

function benchmark(name, run) {
  return { name, run, measurements: [] };
}

const groups = [
  {
    title: "Schema creation + parse",
    benchmarks: [
      benchmark("microtype", () => {
        for (const d of data) {
          do_not_optimize(microtypeSchemaAndParse(d));
        }
      }),
      benchmark("valibot", () => {
        for (const d of data) {
          do_not_optimize(valibotSchemaAndParse(d));
        }
      }),
      benchmark("arktype", () => {
        for (const d of data) {
          do_not_optimize(arktypeSchemaAndParse(d));
        }
      }),
      benchmark("typebox", () => {
        for (const d of data) {
          do_not_optimize(typeboxSchemaAndParse(d));
        }
      }),
      benchmark("zod", () => {
        for (const d of data) {
          do_not_optimize(zodSchemaAndParse(d));
        }
      }),
    ],
  },
  {
    title: "Global schema",
    benchmarks: [
      benchmark("microtype", () => {
        for (const d of data) {
          do_not_optimize(microtypeWithGlobal(d));
        }
      }),
      benchmark("valibot", () => {
        for (const d of data) {
          do_not_optimize(valibotWithGlobal(d));
        }
      }),
      benchmark("arktype", () => {
        for (const d of data) {
          do_not_optimize(arktypeWithGlobal(d));
        }
      }),
      benchmark("typebox", () => {
        for (const d of data) {
          do_not_optimize(typeboxWithGlobal(d));
        }
      }),
      benchmark("typebox [compiled]", () => {
        for (const d of data) {
          do_not_optimize(typeboxWithCompiledGlobal(d));
        }
      }),
      benchmark("zod", () => {
        for (const d of data) {
          do_not_optimize(zodWithGlobal(d));
        }
      }),
    ],
  },
];

const RUNS = 5;

for (let run = 0; run < RUNS; run++) {
  for (const group of groups) {
    for (const benchmark of group.benchmarks) {
      console.log(`[${run + 1}/${RUNS}] ${group.title}: ${benchmark.name}`);
      benchmark.measurements.push((await measure(benchmark.run)).avg);
    }
  }
}

function formatTime(nanoseconds) {
  if (nanoseconds >= 1e6) return `${(nanoseconds / 1e6).toFixed(2)} ms`;
  if (nanoseconds >= 1e3) return `${(nanoseconds / 1e3).toFixed(2)} µs`;
  return `${nanoseconds.toFixed(2)} ns`;
}

function median(values) {
  return values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)];
}

console.log(`Median of ${RUNS} runs; each iteration parses ${data.length} values.`);
for (const group of groups) {
  const results = group.benchmarks
    .map((benchmark) => ({
      name: benchmark.name,
      median: median(benchmark.measurements),
    }))
    .sort((a, b) => a.median - b.median);

  console.log(`\n#### ${group.title}\n`);
  console.log("| name | median |");
  console.log("| --- | ---: |");
  for (const [index, result] of results.entries()) {
    const footnote =
      group.title === "Global schema" &&
      ["arktype", "typebox [compiled]"].includes(result.name)
        ? "\\*"
        : "";
    let name = `${result.name}${footnote}`;
    if (result.name === "microtype") name = `**${name}**`;
    if (index === 0) name = `_${name}_`;
    console.log(`| ${name} | ${formatTime(result.median)} |`);
  }
}

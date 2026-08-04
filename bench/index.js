import { run, bench, boxplot, summary, do_not_optimize } from "mitata";

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

function microtypeCold(val) {
  const LoginSchema = mt.object({
    name: mt.string(),
    platform: mt.union([mt.literal("android"), mt.literal("ios")]),
    versions: mt.array(mt.union([mt.string(), mt.number()])).optional(),
    minVer: mt.number().min(0).max(3),
  });

  return LoginSchema.parse(val);
}

function valibotCold(val) {
  const LoginSchema = v.object({
    name: v.string(),
    platform: v.union([v.literal("android"), v.literal("ios")]),
    versions: v.optional(v.array(v.union([v.string(), v.number()]))),
    minVer: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
  });

  return v.parse(LoginSchema, val);
}

function arktypeCold(val) {
  const LoginSchema = type({
    name: "string",
    platform: "'android' | 'ios'",
    "versions?": "(number | string)[]",
    minVer: "0 <= number <= 3",
  });

  return LoginSchema(val);
}

function typeboxCold(val) {
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

function zodCold(val) {
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

boxplot(() => {
  summary(() => {
    bench("microtype [cold]", () => {
      for (const d of data) {
        do_not_optimize(microtypeCold(d));
      }
      return true;
    });
    bench("microtype [global]", () => {
      for (const d of data) {
        do_not_optimize(microtypeWithGlobal(d));
      }
      return true;
    });
    bench("valibot [cold]", () => {
      for (const d of data) {
        do_not_optimize(valibotCold(d));
      }
      return true;
    });
    bench("valibot [global]", () => {
      for (const d of data) {
        do_not_optimize(valibotWithGlobal(d));
      }
      return true;
    });
    bench("arktype [cold]", () => {
      for (const d of data) {
        do_not_optimize(arktypeCold(d));
      }
      return true;
    });
    bench("arktype [global]", () => {
      for (const d of data) {
        do_not_optimize(arktypeWithGlobal(d));
      }
      return true;
    });
    bench("typebox [cold]", () => {
      for (const d of data) {
        do_not_optimize(typeboxCold(d));
      }
      return true;
    });
    bench("typebox [global]", () => {
      for (const d of data) {
        do_not_optimize(typeboxWithGlobal(d));
      }
      return true;
    });
    bench("typebox [compiled][global]", () => {
      for (const d of data) {
        do_not_optimize(typeboxWithCompiledGlobal(d));
      }
      return true;
    });
    bench("zod [cold]", () => {
      for (const d of data) {
        do_not_optimize(zodCold(d));
      }
      return true;
    });
    bench("zod [global]", () => {
      for (const d of data) {
        do_not_optimize(zodWithGlobal(d));
      }
      return true;
    });
  });
});

await run();

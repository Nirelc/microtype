import { run, bench, boxplot, summary } from "mitata";

import * as mt from "../src/type-system";
import * as v from "valibot";
import { type } from "arktype";

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
    minVer: "0 < number <= 3",
  });

  return LoginSchema(val);
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
  minVer: "0 < number <= 3",
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

boxplot(() => {
  summary(() => {
    bench("microtype [cold]", () => {
      for (const d of data) {
        microtypeCold(d);
      }
      return true;
    });
    bench("microtype [global]", () => {
      for (const d of data) {
        microtypeWithGlobal(d);
      }
      return true;
    });
    bench("valibot [cold]", () => {
      for (const d of data) {
        valibotCold(d);
      }
      return true;
    });
    bench("valibot [global]", () => {
      for (const d of data) {
        valibotWithGlobal(d);
      }
      return true;
    });
    bench("arktype [cold]", () => {
      for (const d of data) {
        arktypeCold(d);
      }
      return true;
    });
    bench("arktype [global]", () => {
      for (const d of data) {
        arktypeWithGlobal(d);
      }
      return true;
    });
  });
});

await run();

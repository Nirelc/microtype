import * as v from "valibot";

const LoginSchema = v.object({
  name: v.string(),
  platform: v.union([v.literal("android"), v.literal("ios")]),
  versions: v.optional(v.array(v.union([v.string(), v.number()]))),
  minVer: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
});

console.log(v.parse(LoginSchema, undefined));

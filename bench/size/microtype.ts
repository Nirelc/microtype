import * as t from "../../dist/index.mjs";

const LoginSchema = t.object({
  name: t.string(),
  platform: t.union([t.literal("android"), t.literal("ios")]),
  versions: t.array(t.union([t.string(), t.number()])).optional(),
  minVer: t.number().min(0).max(3),
  isActive: t.boolean(),
});

console.log(LoginSchema.parse(undefined));

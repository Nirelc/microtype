import * as v from "valibot";

const LoginSchema = v.object({
  name: v.string(),
  platform: v.union([v.literal("android"), v.literal("ios")]),
  versions: v.optional(v.array(v.union([v.string(), v.number()]))),
  minVer: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
});
type LoginData = v.InferOutput<typeof LoginSchema>;

const t = v.parse(LoginSchema, {
  name: "jong doe",
  platform: "ios",
  versions: [1, 2, 3],
  minVer: 3,
} satisfies LoginData);
console.log(t);

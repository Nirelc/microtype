import * as z from "zod";

const LoginSchema = z.object({
  name: z.string(),
  platform: z.union([z.literal("android"), z.literal("ios")]),
  versions: z.array(z.union([z.string(), z.number()])).optional(),
  minVer: z.number().min(0).max(3),
});

console.log(LoginSchema.parse(undefined));

import {
  literal,
  number,
  string,
  union,
  object,
  array,
} from "./src/type-system";

const LoginSchema = object({
  name: string(),
  platform: union([literal("android"), literal("ios")]),
  versions: array(union([string(), number()])).optional(),
  minVer: number().min(0).max(3),
});
type LoginData = typeof LoginSchema.static;

const t = LoginSchema.parse<LoginData>({
  name: "jong doe",
  platform: "ios",
  versions: [1, 2, 3],
  minVer: 3,
});
console.log(t);

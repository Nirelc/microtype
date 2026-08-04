import t from "typebox";
import Schema from "typebox/schema";

const LoginSchema = t.Object({
  name: t.String(),
  platform: t.Union([t.Literal("android"), t.Literal("ios")]),
  versions: t.Optional(t.Array(t.Union([t.String(), t.Number()]))),
  minVer: t.Number({
    minimum: 0,
    maximum: 3,
  }),
});

console.log(Schema.Parse(LoginSchema, undefined));

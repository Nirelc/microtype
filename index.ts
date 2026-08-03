import { type } from "arktype";

const User = type({
  name: "string",
  platform: "'android' | 'ios'",
  "versions?": "(number | string)[]",
  minVer: "0 < number <= 3",
});

type User = typeof User.infer;
const out = User({
  name: "John Doe",
  platform: "ios",
  versions: [1, 2, 3],
  minVer: 3,
} satisfies User);

if (out instanceof type.errors) {
  // hover out.summary to see validation errors
  console.error(out.summary);
} else {
  // hover out to see your validated data
  console.log(out);
}

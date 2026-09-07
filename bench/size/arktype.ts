import { type } from "arktype";

const LoginSchema = type({
  name: "string",
  platform: "'android' | 'ios'",
  "versions?": "(number | string)[]",
  minVer: "0 <= number <= 3",
  isActive: "boolean",
});

console.log(LoginSchema(undefined));

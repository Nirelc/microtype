import { OptionalSchema, type Schema } from "./base";

export function optional<T, I = T>(
  schema: Schema<T, I>,
): OptionalSchema<T, I> {
  return new OptionalSchema<T, I>(schema);
}

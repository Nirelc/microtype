import { OptionalSchema, type Schema } from "./base";

export function optional<T>(schema: Schema<T>): OptionalSchema<T> {
  return new OptionalSchema<T>(schema);
}

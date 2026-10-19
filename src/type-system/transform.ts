import { TransformSchema, type Schema, type TransformFn } from "./base";

export function transform<T, O, I = T>(
  schema: Schema<T, I>,
  transformFn: TransformFn<T, O>,
): TransformSchema<T, O, I> {
  return new TransformSchema<T, O, I>(schema, transformFn);
}

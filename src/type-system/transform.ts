import { TransformSchema, type Schema, type TransformFn } from "./base";

export function transform<T, O>(
  schema: Schema<T>,
  transformFn: TransformFn<T, O>,
): TransformSchema<T, O> {
  return new TransformSchema<T, O>(schema, transformFn);
}

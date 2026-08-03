import { number } from "./number";

export function integer() {
  return number().integer();
}

export function uinteger() {
  return integer().min(0);
}

export function u8() {
  return uinteger().max(255);
}

export function u16() {
  return uinteger().max(65_535);
}

export function u32() {
  return uinteger().max(4_294_967_295);
}

export function i8() {
  return integer().min(-128).max(127);
}

export function i16() {
  return integer().min(-32_768).max(32_767);
}

export function i32() {
  return integer().min(-2_147_483_648).max(2_147_483_647);
}

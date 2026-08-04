import { number, type NumberSchema } from "./number";

export function integer(): NumberSchema {
  return number().integer();
}

export function uinteger(): NumberSchema {
  return integer().min(0);
}

export function u8(): NumberSchema {
  return uinteger().max(255);
}

export function u16(): NumberSchema {
  return uinteger().max(65_535);
}

export function u32(): NumberSchema {
  return uinteger().max(4_294_967_295);
}

export function i8(): NumberSchema {
  return integer().min(-128).max(127);
}

export function i16(): NumberSchema {
  return integer().min(-32_768).max(32_767);
}

export function i32(): NumberSchema {
  return integer().min(-2_147_483_648).max(2_147_483_647);
}

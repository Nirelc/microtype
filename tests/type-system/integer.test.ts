import { describe, test, expect } from "bun:test";

import {
  i16,
  i32,
  i8,
  integer,
  u16,
  u32,
  u8,
  uinteger,
} from "../../src/type-system";

const schema = integer();

describe("integer", () => {
  test("should throw error for floats", () => {
    expect(() => schema.parse(3.14)).toThrow("Expected integer");
  });

  test("aliases should work", () => {
    expect(() => uinteger().parse(-1)).toThrow("Must be >= 0");

    expect(() => u8().parse(256)).toThrow("Must be <= 255");

    expect(() => u16().parse(65_536)).toThrow("Must be <= 65535");
    expect(() => u32().parse(4_294_967_296)).toThrow("Must be <= 4294967295");

    expect(() => i8().parse(128)).toThrow("Must be <= 127");
    expect(() => i8().parse(-129)).toThrow("Must be >= -128");

    expect(() => i16().parse(32_768)).toThrow("Must be <= 32767");
    expect(() => i16().parse(-32_769)).toThrow("Must be >= -32768");

    expect(() => i32().parse(2_147_483_648)).toThrow("Must be <= 2147483647");
    expect(() => i32().parse(-2_147_483_649)).toThrow("Must be >= -2147483648");
  });
});

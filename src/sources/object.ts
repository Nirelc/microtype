import type { ConfigSource } from "./base";

export function objectSource(data: unknown): ConfigSource {
  return {
    name: "object",

    load() {
      return { data };
    },
  };
}

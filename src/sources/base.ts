export interface ConfigSource {
  readonly name: string;
  load(): unknown | Promise<unknown>;
}

export type DefineConfig = {
  schema: unknown;
  sources: ConfigSource[];
};

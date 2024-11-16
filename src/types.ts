import { config as dotenvConfig } from 'dotenv';

type DotenvConfigOptions = Parameters<typeof dotenvConfig>[0];
export type EnvConfig = string | DotenvConfigOptions;

export type Config = Record<string, string>;

export interface ConfigOptions {
  defaults?: Record<string, string>;
  required?: string[];
  expand?: boolean;
  validate?: (config: Record<string, string>) => Record<string, string>;
  transformations?: Record<string, (value: string) => string>;
  schema?: Schema; // Add the schema option
  onValidationError?: (errors: string[]) => void;
}

export interface Schema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean'; // Literal types
    required?: boolean;
    default?: string | number | boolean;
    enum?: (string | number | boolean)[];
  };
}

export type InferConfig<T extends Schema> = {
  [K in keyof T]: T[K]['type'] extends 'string'
    ? string
    : T[K]['type'] extends 'number'
      ? number
      : T[K]['type'] extends 'boolean'
        ? boolean
        : never;
};

export type KeyType = 'string' | 'number' | 'boolean';

export type KeyDefinition<T extends KeyType> = {
  type: T;
  required?: boolean;
  default?: T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never;
  transform?: (
    value: T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never,
  ) => T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never;
  validate?: (
    value: T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never,
  ) => boolean;
};

export type ConfigDefinition = {
  [key: string]: KeyDefinition<KeyType>;
};

export type InferConfigDefinition<T extends ConfigDefinition> = {
  [K in keyof T]: T[K]['required'] extends true
    ? T[K]['type'] extends 'string'
      ? string
      : T[K]['type'] extends 'number'
        ? number
        : T[K]['type'] extends 'boolean'
          ? boolean
          : never
    : T[K]['type'] extends 'string'
      ? string | undefined
      : T[K]['type'] extends 'number'
        ? number | undefined
        : T[K]['type'] extends 'boolean'
          ? boolean | undefined
          : never;
};

import { config as dotenvConfig } from 'dotenv';

type DotenvConfigOptions = Parameters<typeof dotenvConfig>[0];
export type EnvConfig = string | DotenvConfigOptions;
export interface Config {
  [key: string]: string;
}

export interface ConfigOptions {
  defaults?: Config;
  required?: string[];
  errorOnMissing?: boolean;
  expand?: boolean;
  validate?: (config: Config) => Config;
  transformations?: Record<string, (value: string) => string>;
}

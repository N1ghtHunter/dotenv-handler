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

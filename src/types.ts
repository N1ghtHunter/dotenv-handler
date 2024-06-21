export interface Config {
  [key: string]: string;
}

export interface ConfigOptions {
  defaults?: Config;
  required?: string[];
  errorOnMissing?: boolean;
  expand?: boolean;
}

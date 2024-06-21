import { loadEnv, saveEnv } from './utils';
import { Config, ConfigOptions } from './types';

const config: Config = {};

export const loadConfig = (envFilePath: string = '.env', options: ConfigOptions = {}): void => {
  loadEnv(envFilePath);

  for (const key in process.env) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      config[key] = process.env[key] as string;
    }
  }

  if (options.defaults) {
    setDefaults(options.defaults);
  }

  if (options.required) {
    validateConfig(config, options.required);
  }
};

export const setDefaults = (defaults: Config): void => {
  for (const key in defaults) {
    if (!config[key]) {
      config[key] = defaults[key];
    }
  }
};

export const getConfig = (key: string): string | undefined => {
  return config[key];
};

export const saveConfig = (filePath: string = '.env'): void => {
  saveEnv(filePath);
};

const validateConfig = (config: Config, required: string[]): void => {
  const missingKeys = required.filter(key => !config[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
  }
};

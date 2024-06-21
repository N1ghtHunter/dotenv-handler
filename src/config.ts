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

  if (options.expand) {
    expandConfig();
  }

  const missingKeys = validateConfig(config, options.required || []);
  handleMissingKeys(missingKeys, options);
};

const expandConfig = (): void => {
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      config[key] = expandVariable(config[key]);
    }
  }
};

const expandVariable = (value: string): string => {
  return value.replace(/\${(\w+)}/g, (_, name) => {
    if (name in config) {
      return config[name];
    }
    return '';
  });
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

const validateConfig = (config: Config, required: string[]): string[] => {
  return required.filter(key => !config[key]);
};

const handleMissingKeys = (missingKeys: string[], options: ConfigOptions): void => {
  const { errorOnMissing = true } = options;
  if (missingKeys.length > 0) {
    const message = `Missing required environment variables: ${missingKeys.join(', ')}`;
    if (errorOnMissing) throw new Error(message);
    else console.warn(message);
  }
};

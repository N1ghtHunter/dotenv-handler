import { Config, ConfigOptions } from './types';

export const validateConfig = (config: Config, required: string[]): string[] => {
  return required.filter(key => !config[key]);
};

export const handleMissingKeys = (missingKeys: string[], options: ConfigOptions): void => {
  const { errorOnMissing = true } = options;
  if (missingKeys.length > 0) {
    const message = `Missing required environment variables: ${missingKeys.join(', ')}`;
    if (errorOnMissing) throw new Error(message);
    else console.warn(message);
  }
};

export const expandVariable = (value: string, config: Config): string => {
  return value.replace(/\${(\w+)}/g, (_, name) => {
    if (name in config) {
      return config[name];
    }
    return '';
  });
};

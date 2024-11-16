import path from 'path';
import { ConfigDefinition, EnvConfig, InferConfigDefinition } from './types';
import fs from 'fs';
import dotenv from 'dotenv';

// Configuration Manager Class
class ConfigManager<T extends ConfigDefinition> {
  private schema: T;
  private config: Partial<InferConfigDefinition<T>> = {};
  private onValidationError?: (errors: string[]) => void;
  constructor(
    envPath: string,
    {
      schema,
      onValidationError,
    }: {
      schema: T;
      validate?: (config: InferConfigDefinition<T>) => InferConfigDefinition<T>;
      onValidationError?: (errors: string[]) => void;
    },
  ) {
    this.schema = schema;
    this.onValidationError = onValidationError;
    this.loadEnv(envPath);
    this.initializeConfig();
    this.applyTransformations();
  }

  private loadEnv(envConfig: EnvConfig): void {
    if (typeof envConfig === 'string') {
      const envPath = path.resolve(envConfig);
      if (!fs.existsSync(envPath)) {
        throw new Error(`The file ${envConfig} does not exist`);
      }
      dotenv.config({ path: envPath });
    } else {
      dotenv.config(envConfig);
    }
  }

  private initializeConfig() {
    const errors: string[] = [];
    for (const key in this.schema) {
      const definition = this.schema[key];
      if (process.env[key] !== undefined) {
        // Set value from environment variable
        this.config[key as keyof InferConfigDefinition<T>] = process.env[
          key
        ] as T[keyof InferConfigDefinition<T>]['type'] extends 'string'
          ? string
          : T[keyof InferConfigDefinition<T>]['type'] extends 'number'
            ? number
            : T[keyof InferConfigDefinition<T>]['type'] extends 'boolean'
              ? boolean
              : never;
        if (definition.validate && !definition.validate(this.config[key as keyof InferConfigDefinition<T>]!)) {
          errors.push(`Validation failed for key: ${key}`);
        }
      } else if (definition.default !== undefined) {
        // Set default value
        this.config[key as keyof InferConfigDefinition<T>] =
          definition.default as T[keyof InferConfigDefinition<T>]['type'] extends 'string'
            ? string
            : T[keyof InferConfigDefinition<T>]['type'] extends 'number'
              ? number
              : T[keyof InferConfigDefinition<T>]['type'] extends 'boolean'
                ? boolean
                : never;
      } else if (definition.required) {
        throw new Error(`Missing required configuration key: ${key}`);
      }
      this.errorHandle(errors);
    }
  }

  private errorHandle(errors: string[]) {
    if (errors.length > 0) {
      if (this.onValidationError) {
        this.onValidationError(errors);
      } else {
        console.warn(errors.join('\n'));
      }
    }
  }

  public setConfig(config: Partial<InferConfigDefinition<T>>) {
    for (const key in config) {
      if (!(key in this.schema)) {
        throw new Error(`Unknown configuration key: ${key}`);
      }
      this.config[key as keyof InferConfigDefinition<T>] = config[key];
    }
  }

  public getConfig(): InferConfigDefinition<T> {
    return this.config as InferConfigDefinition<T>;
  }

  public getValue<K extends keyof InferConfigDefinition<T>>(key: K): InferConfigDefinition<T>[K] {
    if (this.config[key] === undefined && this.schema[key].required) {
      throw new Error(`Missing required configuration value for key: ${String(key)}`);
    }
    return this.config[key]!;
  }

  applyTransformations() {
    for (const key in this.schema) {
      const definition = this.schema[key];
      if (
        definition.transform &&
        this.config[key] !== undefined &&
        typeof this.config[key] === definition.type &&
        this.getValue(key) !== undefined
      ) {
        const transformedValue = definition.transform(this.getValue(key)!);
        if (typeof transformedValue === definition.type) {
          this.config[key as keyof InferConfigDefinition<T>] = transformedValue as InferConfigDefinition<T>[typeof key];
        } else {
          throw new Error(
            `Transformation for key "${key}" did not return a ${definition.type}. Actual: ${typeof transformedValue}`,
          );
        }
      }
    }
  }
}

// Define a helper function to ensure correct typing
// function defineConfig<T extends ConfigDefinition>(config: T): T {
//   return config;
// }

// // Use the helper function to define the schema
// const configSchema = defineConfig({
//   PORT: { type: 'number', required: true, default: '3000', transform: value => Number(value) },
//   DB_USER: { type: 'string', required: true },
//   ENABLE_LOGS: { type: 'boolean', default: false },
// });

// Create an instance of ConfigManager
const configManager = new ConfigManager('.env', {
  schema: {
    PORT: { type: 'number', required: true, default: '3000', transform: value => Number(value) },
    DB_USER: { type: 'string', required: true },
    ENABLE_LOGS: { type: 'boolean', default: false },
  },
});

configManager.getValue('PORT');

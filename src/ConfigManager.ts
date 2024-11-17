import path from 'path';
import { ConfigDefinition, EnvConfig, InferConfigDefinition } from './types';
import fs from 'fs';
import dotenv from 'dotenv';

// Configuration Manager Class
class ConfigManager<T extends ConfigDefinition> {
  private schema: T;
  private config: Partial<InferConfigDefinition<T>> = {};
  private onValidationError?: (errors: string[]) => void;
  private NODE_ENV: string = process.env.NODE_ENV || 'development';
  constructor(
    envConfig: EnvConfig,
    {
      schema,
      onValidationError,
      detectNodeEnv = false,
    }: {
      schema: T;
      detectNodeEnv?: boolean;
      onValidationError?: (errors: string[]) => void;
    },
  ) {
    this.schema = schema;
    this.onValidationError = onValidationError;
    this.loadEnv(envConfig, detectNodeEnv);
    this.initializeConfig();
    this.applyTransformations();
  }

  private getEnvPath(envConfig: EnvConfig): string {
    if (!envConfig) {
      return process.cwd();
    }

    if (typeof envConfig === 'string') {
      return path.resolve(envConfig);
    }

    return path.resolve(envConfig.path);
  }

  private validateEnvFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Environment file not found: ${filePath}`);
    }

    const validExtensionsRegex = /\.env(\.[a-zA-Z]+)?$/;
    const fileExt = path.extname(filePath);
    if (!validExtensionsRegex.test(fileExt)) {
      throw new Error(`Invalid environment file extension: ${fileExt}`);
    }
  }

  private loadEnv(envConfig?: EnvConfig, detectNodeEnv = false): void {
    const basePath = this.getEnvPath(envConfig);
    const envPath = detectNodeEnv ? `${basePath}.${this.NODE_ENV}` : basePath;

    this.validateEnvFile(envPath);

    const config = typeof envConfig === 'object' ? envConfig : { path: envPath };
    dotenv.config(config);
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

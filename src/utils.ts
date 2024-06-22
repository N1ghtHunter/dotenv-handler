import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './types';
export function loadEnv(envConfig: EnvConfig): void {
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

export function getEnv(key: string): string | undefined {
  return process.env[key];
}

export function setEnv(key: string, value: string): void {
  process.env[key] = value;
}

export function saveEnv(filePath: string = '.env'): void {
  const envPath = path.resolve(filePath);
  const envContent = Object.keys(process.env)
    .map(key => `${key}=${process.env[key]}`)
    .join('\n');
  fs.writeFileSync(envPath, envContent);
}

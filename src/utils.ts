import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export function loadEnv(filePath: string): void {
  const envPath = path.resolve(filePath);
  if (!fs.existsSync(envPath)) {
    throw new Error(`The file ${filePath} does not exist`);
  }
  dotenv.config({ path: envPath });
}

export function getEnv(key: string): string | undefined {
  return process.env[key];
}

export function setEnv(key: string, value: string): void {
  process.env[key] = value;
}

export function saveEnv(filePath: string): void {
  const envPath = path.resolve(filePath);
  const envContent = Object.keys(process.env)
    .map(key => `${key}=${process.env[key]}`)
    .join('\n');
  fs.writeFileSync(envPath, envContent);
}

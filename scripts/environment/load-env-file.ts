import { existsSync } from 'node:fs';

export function loadEnvironmentFile(
  envFile = process.env.ENV_FILE ?? '.env',
): void {
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

export function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set`);
  }

  return value;
}

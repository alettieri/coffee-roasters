import { existsSync } from 'node:fs';

export function loadEnvironmentFile(
  envFile = process.env.ENV_FILE ?? '.env',
): void {
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

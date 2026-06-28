import { spawn } from 'node:child_process';

import { loadEnvironmentFile } from '../environment/load-env-file';

loadEnvironmentFile('.env.test');

const child = spawn('nuxt', ['dev', '--host', '127.0.0.1', '--port', '3000'], {
  env: process.env,
  stdio: 'inherit',
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

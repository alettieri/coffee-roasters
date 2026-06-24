import { spawnSync } from 'node:child_process';

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env: {
      ...process.env,
      MIGRATION_DATABASE_URL:
        process.env.MIGRATION_DATABASE_URL ??
        'postgres://migration_check:migration_check@127.0.0.1:1/migration_check',
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function capture(command: string, args: string[]): string {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout;
}

run('pnpm', ['exec', 'drizzle-kit', 'generate']);

const drizzleStatus = capture('git', [
  'status',
  '--porcelain',
  '--',
  'drizzle',
]);

if (drizzleStatus.trim().length > 0) {
  process.stderr.write(`Changed Drizzle files:\n${drizzleStatus}\n`);
  run('git', ['diff', '--', 'drizzle']);
  process.stderr.write(
    'Drizzle migrations are not consistent with the current schema. Run pnpm db:generate and commit the generated migration files.\n',
  );
  process.exit(1);
}

import { z } from 'zod';

const postgresUrlPattern = /^postgres(?:ql)?:\/\//u;

const databaseUrlSchema = z
  .string()
  .min(1)
  .url()
  .refine((value) => postgresUrlPattern.test(value), {
    message: 'Database URLs must use a PostgreSQL URL scheme',
  });

export const serverEnvironmentSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
});

export const betterAuthEnvironmentSchema = z.object({
  BETTER_AUTH_URL: z.string().min(1).url(),
  BETTER_AUTH_SECRET: z.string().min(32),
});

export const productionBetterAuthBindingsSchema = z.object({
  BETTER_AUTH_URL: z.string().min(1).url(),
  BETTER_AUTH_SECRET: z.string().min(32),
});

export const productionHyperdriveBindingSchema = z.object({
  connectionString: databaseUrlSchema,
});

export const productionCloudflareBindingsSchema = z.object({
  PRODUCTION_HYPERDRIVE: productionHyperdriveBindingSchema,
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type BetterAuthEnvironment = z.infer<typeof betterAuthEnvironmentSchema>;
export type ProductionBetterAuthBindings = z.infer<
  typeof productionBetterAuthBindingsSchema
>;
export type ProductionCloudflareBindings = z.infer<
  typeof productionCloudflareBindingsSchema
>;

interface RuntimeEventLike {
  context?: unknown;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getCloudflareRuntimeEnvironment(
  event?: RuntimeEventLike,
): Record<string, string | undefined> | undefined {
  const platformContext = isObjectRecord(event?.context)
    ? event.context._platform
    : undefined;
  const cloudflareContext = isObjectRecord(platformContext)
    ? platformContext.cloudflare
    : undefined;
  const cloudflareEnv = isObjectRecord(cloudflareContext)
    ? cloudflareContext.env
    : undefined;

  if (!isObjectRecord(cloudflareEnv)) {
    return undefined;
  }

  return cloudflareEnv as Record<string, string | undefined>;
}

export function parseServerEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  return serverEnvironmentSchema.parse(source);
}

export function resolveLocalDatabaseConnectionString(
  source: NodeJS.ProcessEnv = process.env,
): string {
  return parseServerEnvironment(source).DATABASE_URL;
}

export function parseBetterAuthEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): BetterAuthEnvironment {
  return betterAuthEnvironmentSchema.parse(source);
}

export function resolveProductionDatabaseConnectionString(
  bindings: unknown,
): string {
  return productionCloudflareBindingsSchema.parse(bindings)
    .PRODUCTION_HYPERDRIVE.connectionString;
}

export function resolveProductionBetterAuthRuntimeConfiguration(
  bindings: unknown,
): BetterAuthEnvironment {
  const result = productionBetterAuthBindingsSchema.safeParse(bindings);
  if (!result.success) {
    throw new Error(
      'Cloudflare Pages production runtime requires the BETTER_AUTH_URL and BETTER_AUTH_SECRET bindings.',
    );
  }

  return result.data;
}

export function resolveBetterAuthRuntimeConfiguration(
  event?: RuntimeEventLike,
  source: NodeJS.ProcessEnv = process.env,
): BetterAuthEnvironment {
  const cloudflareEnv = getCloudflareRuntimeEnvironment(event);
  if (cloudflareEnv !== undefined) {
    if (cloudflareEnv.APP_ENV === 'production') {
      return resolveProductionBetterAuthRuntimeConfiguration(cloudflareEnv);
    }

    return parseBetterAuthEnvironment({
      ...source,
      ...cloudflareEnv,
    });
  }

  return parseBetterAuthEnvironment(source);
}

export function resolveRuntimeDatabaseConnectionString(
  event?: RuntimeEventLike,
  source: NodeJS.ProcessEnv = process.env,
): string {
  const platformContext = isObjectRecord(event?.context)
    ? event.context._platform
    : undefined;
  const cloudflareBindings = isObjectRecord(platformContext)
    ? isObjectRecord(platformContext.cloudflare)
      ? platformContext.cloudflare.env
      : undefined
    : undefined;

  if (cloudflareBindings !== undefined) {
    if (
      isObjectRecord(cloudflareBindings) &&
      'PRODUCTION_HYPERDRIVE' in cloudflareBindings
    ) {
      return resolveProductionDatabaseConnectionString(cloudflareBindings);
    }

    if (
      isObjectRecord(cloudflareBindings) &&
      cloudflareBindings.APP_ENV === 'production'
    ) {
      throw new Error(
        'Cloudflare Pages production runtime requires the PRODUCTION_HYPERDRIVE binding with a connectionString.',
      );
    }
  }

  return resolveLocalDatabaseConnectionString(source);
}

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

export const productionHyperdriveBindingSchema = z.object({
  connectionString: databaseUrlSchema,
});

export const productionCloudflareBindingsSchema = z.object({
  PRODUCTION_HYPERDRIVE: productionHyperdriveBindingSchema,
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type ProductionCloudflareBindings = z.infer<
  typeof productionCloudflareBindingsSchema
>;

interface CloudflarePlatformContext {
  env?: unknown;
}

interface NitroPlatformContext {
  cloudflare?: CloudflarePlatformContext;
}

interface NitroEventLike {
  context?: {
    _platform?: NitroPlatformContext;
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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

export function resolveProductionDatabaseConnectionString(
  bindings: unknown,
): string {
  return productionCloudflareBindingsSchema.parse(bindings)
    .PRODUCTION_HYPERDRIVE.connectionString;
}

export function resolveRuntimeDatabaseConnectionString(
  event?: NitroEventLike,
  source: NodeJS.ProcessEnv = process.env,
): string {
  const cloudflareBindings = event?.context?._platform?.cloudflare?.env;

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

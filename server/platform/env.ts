import { z } from 'zod';

const postgresUrlPattern = /^postgres(?:ql)?:\/\//u;

export const serverEnvironmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .url()
    .refine((value) => postgresUrlPattern.test(value), {
      message: 'DATABASE_URL must be a postgres:// or postgresql:// URL',
    }),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function parseServerEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  return serverEnvironmentSchema.parse(source);
}

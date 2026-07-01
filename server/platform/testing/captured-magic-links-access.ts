import { createError } from 'h3';

export const capturedMagicLinksTestHeaderName =
  'x-test-only-captured-magic-links-secret';

export const capturedMagicLinksTestSecretEnvName = 'TEST_ONLY_CAPTURE_SECRET';

export function resolveCapturedMagicLinksTestSecret(
  source: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const secret = source[capturedMagicLinksTestSecretEnvName];

  if (!secret) {
    return undefined;
  }

  return secret;
}

export function canAccessCapturedMagicLinksBridge(
  requestSecret: string | undefined,
  source: NodeJS.ProcessEnv = process.env,
): boolean {
  const isTestRuntime = source.APP_ENV === 'test' || source.NODE_ENV === 'test';

  if (!isTestRuntime) {
    return false;
  }

  const expectedSecret = resolveCapturedMagicLinksTestSecret(source);
  if (!expectedSecret) {
    return false;
  }

  return requestSecret === expectedSecret;
}

export function requireCapturedMagicLinksBridgeAccess(
  requestSecret: string | undefined,
  source: NodeJS.ProcessEnv = process.env,
): void {
  if (canAccessCapturedMagicLinksBridge(requestSecret, source)) {
    return;
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  });
}

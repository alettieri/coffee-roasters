import { afterEach, describe, expect, it } from 'vitest';
import { createApp, toWebHandler } from 'h3';

import getCapturedMagicLinksRoute from '../../server/api/testing/captured-magic-links.get';
import resetCapturedMagicLinksRoute from '../../server/api/testing/captured-magic-links.delete';
import {
  captureMagicLink,
  resetCapturedMagicLinks,
} from '../../server/platform/auth/magic-link-capture';
import {
  capturedMagicLinksTestHeaderName,
  capturedMagicLinksTestSecretEnvName,
} from '../../server/platform/testing/captured-magic-links-access';
import { requireEnvironmentVariable } from '../../scripts/environment/load-env-file';

const appOrigin = 'http://localhost:3000';
const testOnlyCapturedMagicLinksSecret = requireEnvironmentVariable(
  capturedMagicLinksTestSecretEnvName,
);

function createGetRouteHandler(): (request: Request) => Promise<Response> {
  const app = createApp();
  app.use('/api/testing/captured-magic-links', getCapturedMagicLinksRoute);
  return toWebHandler(app);
}

function createDeleteRouteHandler(): (request: Request) => Promise<Response> {
  const app = createApp();
  app.use('/api/testing/captured-magic-links', resetCapturedMagicLinksRoute);
  return toWebHandler(app);
}

function createHeaders(secret = testOnlyCapturedMagicLinksSecret): Headers {
  return new Headers({
    [capturedMagicLinksTestHeaderName]: secret,
    origin: appOrigin,
  });
}

describe('captured magic links test bridge', () => {
  afterEach(() => {
    resetCapturedMagicLinks();
    delete process.env.APP_ENV;
    delete process.env.TEST_ONLY_CAPTURE_SECRET;
  });

  it('returns 404 without the synthetic secret and reveals nothing', async () => {
    process.env.APP_ENV = 'test';
    process.env.TEST_ONLY_CAPTURE_SECRET = testOnlyCapturedMagicLinksSecret;

    captureMagicLink({
      email: 'route-denial@example.com',
      token: 'token-denial',
      url: `${appOrigin}/api/auth/magic-link/verify?token=token-denial`,
    });

    const getResponse = await createGetRouteHandler()(
      new Request(`${appOrigin}/api/testing/captured-magic-links`, {
        method: 'GET',
        headers: {
          origin: appOrigin,
        },
      }),
    );

    expect(getResponse.status).toBe(404);

    const deleteResponse = await createDeleteRouteHandler()(
      new Request(`${appOrigin}/api/testing/captured-magic-links`, {
        method: 'DELETE',
        headers: createHeaders('wrong-secret'),
      }),
    );

    expect(deleteResponse.status).toBe(404);
  });

  it('returns and clears captured links only when the secret matches', async () => {
    process.env.APP_ENV = 'test';
    process.env.TEST_ONLY_CAPTURE_SECRET = testOnlyCapturedMagicLinksSecret;

    captureMagicLink({
      email: 'route-allowed@example.com',
      token: 'token-allowed',
      url: `${appOrigin}/api/auth/magic-link/verify?token=token-allowed`,
    });

    const getResponse = await createGetRouteHandler()(
      new Request(`${appOrigin}/api/testing/captured-magic-links`, {
        method: 'GET',
        headers: createHeaders(),
      }),
    );

    expect(getResponse.status).toBe(200);
    await expect(getResponse.json()).resolves.toEqual([
      {
        email: 'route-allowed@example.com',
        metadata: undefined,
        token: 'token-allowed',
        url: `${appOrigin}/api/auth/magic-link/verify?token=token-allowed`,
      },
    ]);

    const deleteResponse = await createDeleteRouteHandler()(
      new Request(`${appOrigin}/api/testing/captured-magic-links`, {
        method: 'DELETE',
        headers: createHeaders(),
      }),
    );

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({ status: true });

    const emptyResponse = await createGetRouteHandler()(
      new Request(`${appOrigin}/api/testing/captured-magic-links`, {
        method: 'GET',
        headers: createHeaders(),
      }),
    );

    expect(emptyResponse.status).toBe(200);
    await expect(emptyResponse.json()).resolves.toEqual([]);
  });
});

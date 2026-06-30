import { describe, expect, it } from 'vitest';

import {
  canAccessCapturedMagicLinksBridge,
  resolveCapturedMagicLinksTestSecret,
} from '../../server/platform/testing/captured-magic-links-access';

describe('captured magic links bridge access guard', () => {
  it('requires the test runtime and matching secret', () => {
    const testRuntime = {
      APP_ENV: 'test',
      TEST_ONLY_CAPTURE_SECRET: 'coffee-roasters-test-secret',
    } as NodeJS.ProcessEnv;

    expect(
      canAccessCapturedMagicLinksBridge(
        'coffee-roasters-test-secret',
        testRuntime,
      ),
    ).toBe(true);
    expect(canAccessCapturedMagicLinksBridge('wrong-secret', testRuntime)).toBe(
      false,
    );
    expect(canAccessCapturedMagicLinksBridge(undefined, testRuntime)).toBe(
      false,
    );
    expect(
      canAccessCapturedMagicLinksBridge('coffee-roasters-test-secret', {
        APP_ENV: 'production',
        TEST_ONLY_CAPTURE_SECRET: 'coffee-roasters-test-secret',
      } as NodeJS.ProcessEnv),
    ).toBe(false);
  });

  it('treats a missing synthetic secret as inaccessible', () => {
    expect(
      resolveCapturedMagicLinksTestSecret({
        APP_ENV: 'test',
      } as NodeJS.ProcessEnv),
    ).toBeUndefined();
  });
});

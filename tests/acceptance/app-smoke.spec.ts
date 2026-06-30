import { sql } from 'drizzle-orm';
import type { Page } from '@playwright/test';
import { expect, test } from '@nuxt/test-utils/playwright';

import { createDatabaseClient } from '../../server/platform/database/client';
import {
  account,
  session,
  user,
  verification,
} from '../../server/platform/database/schema';
import type { CapturedMagicLink } from '../../server/platform/auth/magic-link-capture';
import { requireEnvironmentVariable } from '../../scripts/environment/load-env-file';

const databaseUrl = requireEnvironmentVariable('DATABASE_URL');
const databaseClient = createDatabaseClient(databaseUrl, { maxConnections: 1 });
const coffeeLoverEmail = 'browser-coffee-lover@example.com';

async function resetAuthState() {
  await databaseClient.db.execute(
    sql`truncate table ${account}, ${session}, ${verification}, ${user} restart identity cascade`,
  );
}

async function requestMagicLink(page: Page) {
  await page.goto('/sign-in', {
    waitUntil: 'networkidle',
  });

  await page.getByLabel('Email address').fill(coffeeLoverEmail);
  await page.getByRole('button', { name: 'Send magic link' }).click();

  await expect(page.getByRole('status')).toContainText(
    `Magic link requested for ${coffeeLoverEmail}.`,
  );
}

async function getCapturedMagicLinks(page: Page): Promise<CapturedMagicLink[]> {
  const response = await page.request.get('/api/testing/captured-magic-links');

  expect(response.ok()).toBe(true);

  return (await response.json()) as CapturedMagicLink[];
}

async function completeCapturedMagicLink(page: Page) {
  const capturedLinks = await getCapturedMagicLinks(page);
  expect(capturedLinks).toHaveLength(1);

  await page.goto(capturedLinks[0].url, {
    waitUntil: 'networkidle',
  });
}

test.beforeEach(async ({ page }) => {
  await resetAuthState();
  await page.request.delete('/api/testing/captured-magic-links');
});

test.afterAll(async () => {
  await databaseClient.close();
});

test('successful login lands in the authenticated app state and keeps the session across navigation', async ({
  page,
}) => {
  await requestMagicLink(page);
  await completeCapturedMagicLink(page);

  await expect(
    page.getByRole('heading', { name: /Signed in as/ }),
  ).toBeVisible();
  await expect(page.locator('.status-card')).toContainText(coffeeLoverEmail);
  await expect(page.locator('.status-card')).toContainText('coffee_lover');
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'My Roasters' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'My Roasters' }),
  ).toBeVisible();
  await expect(page.locator('.session-card')).toContainText('coffee_lover');

  await page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Track the roasters you want to try, have tried, and want to revisit.',
    }),
  ).toBeVisible();

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'My Roasters' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'My Roasters' }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'My Roasters' }),
  ).toBeVisible();
  await expect(page.locator('.session-card')).toContainText('coffee_lover');
});

test('sign-out clears the session and blocks the authenticated route', async ({
  page,
}) => {
  await requestMagicLink(page);
  await completeCapturedMagicLink(page);

  await page.getByRole('button', { name: 'Sign out' }).click();

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(
    page.getByRole('heading', {
      name: 'Request a magic link with your email address.',
    }),
  ).toBeVisible();

  await page.goto('/my-roasters', {
    waitUntil: 'networkidle',
  });

  await expect(
    page.getByRole('heading', {
      name: 'Request a magic link with your email address.',
    }),
  ).toBeVisible();
});

test('signed-out visitors are denied the authenticated route and default to coffee_lover', async ({
  page,
}) => {
  await page.goto('/my-roasters', {
    waitUntil: 'networkidle',
  });

  await expect(
    page.getByRole('heading', {
      name: 'Request a magic link with your email address.',
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/sign-in/);
});

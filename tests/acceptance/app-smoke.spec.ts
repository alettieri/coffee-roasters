import { expect, test } from '@playwright/test';

test('renders the placeholder landing page and keeps browser state', async ({
  page,
  context,
}) => {
  const baseURL = 'http://127.0.0.1:3000';

  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Personal roaster tracking is being prepared.',
    }),
  ).toBeVisible();

  await context.addCookies([
    {
      name: 'browser-acceptance-session',
      value: 'ready',
      url: baseURL,
    },
  ]);

  await page.reload();

  await expect(
    page.getByRole('heading', {
      name: 'Personal roaster tracking is being prepared.',
    }),
  ).toBeVisible();
  const cookies = await context.cookies();
  expect(cookies).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'browser-acceptance-session',
        value: 'ready',
      }),
    ]),
  );
});

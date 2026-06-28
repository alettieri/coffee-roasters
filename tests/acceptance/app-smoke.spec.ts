import { expect, test } from '@nuxt/test-utils/playwright';

test('renders the placeholder landing page and keeps browser state', async ({
  page,
  context,
  goto,
}) => {
  const baseURL = 'http://127.0.0.1:3000';

  await goto('/', { waitUntil: 'hydration' });

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

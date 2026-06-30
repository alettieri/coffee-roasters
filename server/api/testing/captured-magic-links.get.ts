import { createError, defineEventHandler } from 'h3';

import { listCapturedMagicLinks } from '../../platform/auth/magic-link-capture';

function ensureTestEnvironment() {
  if (process.env.APP_ENV === 'test' || process.env.NODE_ENV === 'test') {
    return;
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  });
}

export default defineEventHandler(() => {
  ensureTestEnvironment();

  return listCapturedMagicLinks();
});

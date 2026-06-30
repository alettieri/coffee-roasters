import { createError, defineEventHandler } from 'h3';

import { resetCapturedMagicLinks } from '../../platform/auth/magic-link-capture';

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
  resetCapturedMagicLinks();

  return {
    status: true,
  };
});

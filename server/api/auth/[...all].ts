import { toWebRequest, defineEventHandler } from 'h3';

import { getRuntimeAuth } from '../../platform/auth/auth';

export default defineEventHandler((event) => {
  return getRuntimeAuth(event).handler(toWebRequest(event));
});

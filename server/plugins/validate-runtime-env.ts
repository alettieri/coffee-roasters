import { parseServerEnvironment } from '../platform/env';

export default defineNitroPlugin(() => {
  parseServerEnvironment();
});

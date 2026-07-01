import { defineEventHandler, getHeader } from 'h3';

import { resetCapturedMagicLinks } from '../../platform/auth/magic-link-capture';
import {
  capturedMagicLinksTestHeaderName,
  requireCapturedMagicLinksBridgeAccess,
} from '../../platform/testing/captured-magic-links-access';

export default defineEventHandler((event) => {
  requireCapturedMagicLinksBridgeAccess(
    getHeader(event, capturedMagicLinksTestHeaderName),
  );
  resetCapturedMagicLinks();

  return {
    status: true,
  };
});

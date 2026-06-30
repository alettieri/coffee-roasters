import { defineEventHandler, toWebRequest } from 'h3';

import { getRuntimeAuth } from '../platform/auth/auth';
import { getAuthenticatedActor } from '../modules/identity-access/server-session';

export default defineEventHandler(async (event) => {
  const auth = getRuntimeAuth(event);
  const actor = await getAuthenticatedActor(auth, toWebRequest(event).headers);

  if (!actor) {
    return {
      authenticated: false,
      session: null,
      user: null,
    };
  }

  return {
    authenticated: true,
    session: {
      expiresAt: new Date(actor.session.expiresAt).toISOString(),
    },
    user: {
      email: actor.user.email,
      emailVerified: actor.user.emailVerified,
      id: actor.user.id,
      image: actor.user.image,
      name: actor.user.name,
      role: actor.user.role,
    },
  };
});

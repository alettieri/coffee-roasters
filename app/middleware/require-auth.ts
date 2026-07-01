export default defineNuxtRouteMiddleware(async (to) => {
  const headers = import.meta.server
    ? useRequestHeaders(['cookie'])
    : undefined;
  const session = await fetchAuthSession(headers);

  if (session.authenticated) {
    return;
  }

  return navigateTo({
    path: '/sign-in',
    query: {
      redirect: to.fullPath,
    },
  });
});

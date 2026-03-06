/**
 * Fetches the current authenticated user from the API.
 * Forwards cookies so it works on both SSR and client-side.
 * Returns null if the user is not logged in or an error occurs.
 */
export const useCurrentUser = async () => {
  const headers = useRequestHeaders(["cookie"]);
  return (await $fetch("/api/auth/user", { headers }).catch(() => null)) as any;
};

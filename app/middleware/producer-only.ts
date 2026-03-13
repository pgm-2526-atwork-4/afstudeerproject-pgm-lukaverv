/**
 * Middleware to restrict access to producers only.
 * - Unauthenticated → /auth/login
 * - LISTENER → /unauthorized
 * - PRODUCER → access granted
 *
 * Uses /api/auth/user which handles both OAuth and manual JWT login.
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = await useCurrentUser();

  if (!user) return navigateTo("/auth/login");
  if (user.role !== "PRODUCER")
    return navigateTo("/unauthorized?reason=producers-only");
});

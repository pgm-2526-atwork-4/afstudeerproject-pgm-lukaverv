/**
 * Middleware to require authentication.
 * - Unauthenticated → /auth/login
 * - Authenticated → access granted
 *
 * Fast path: on client-side navigation, if userProfile is already loaded in
 * global state (populated by the Navbar), skip the extra API roundtrip to Neon.
 * This prevents false redirects caused by Neon DB latency on the auth check.
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    const userProfile = useState("userProfile");
    if (userProfile.value) return; // already authenticated, skip API call
  }
  const user = await useCurrentUser();
  if (!user) return navigateTo("/auth/login");
});

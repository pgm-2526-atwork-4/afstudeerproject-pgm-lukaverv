export default defineNuxtRouteMiddleware(async (to) => {
  const { status, data: session } = useAuth();

  // Allow unauthenticated users (guest access)
  if (status.value !== "authenticated") {
    return;
  }

  // Don't check on auth pages, index page, or profile creation page
  if (
    to.path.startsWith("/auth") ||
    to.path === "/profile/create" ||
    to.path === "/"
  ) {
    return;
  }

  // Wait for session to be fully loaded and check for profile
  const user = session.value?.user as any;

  // Only redirect if we explicitly know there's no profile (false, not undefined)
  if (user && user.hasProfile === false) {
    return navigateTo("/profile/create");
  }
});

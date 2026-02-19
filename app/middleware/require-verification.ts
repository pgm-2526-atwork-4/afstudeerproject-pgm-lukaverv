export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow guest access to '/discover'
  if (to.path === "/discover") {
    return;
  }

  // Verify user status by fetching user info (cookie is sent automatically)
  try {
    const user = await $fetch("/api/user", {
      credentials: "include",
    });

    // User not verified - redirect to verification pending with email
    if (!user.isVerified) {
      return navigateTo(
        `/auth/verification-pending?email=${encodeURIComponent(user.email)}`,
      );
    }

    // User is verified - allow access (no redirect)
  } catch (error) {
    // Invalid token or error - redirect to login
    return navigateTo("/auth/login");
  }
});

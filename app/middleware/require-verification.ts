export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem("token");

  // No token - only allow access to '/discover' for guests
  if (!token) {
    if (to.path === "/discover") {
      return; // Allow guest access to discover page
    }
    return navigateTo("/auth/login");
  }

  // Token exists - verify user status
  try {
    // Fetch user with token
    const user = await $fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
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
    localStorage.removeItem("token");
    return navigateTo("/auth/login");
  }
});

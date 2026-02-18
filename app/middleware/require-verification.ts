export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem("token");

  // No token - redirect to login
  if (!token) {
    return navigateTo("/auth/login");
  }

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

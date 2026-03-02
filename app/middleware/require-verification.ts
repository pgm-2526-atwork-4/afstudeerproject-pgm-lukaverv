export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow guest access to public pages
  const publicPages = [
    "/discover",
    // Allow viewing other users' profiles (pattern: /profile/{userId})
  ];

  // Check if it's a guest-accessible page
  if (publicPages.some((page) => to.path.startsWith(page))) {
    return;
  }

  // Allow guests to view other users' profiles (/profile/[id])
  // But NOT their own profile page (/profile)
  if (to.path.startsWith("/profile/") && to.path !== "/profile/") {
    return;
  }

  // At this point, the user is trying to access a protected page
  // Check for OAuth session first
  const { status, data: session } = useAuth();

  if (status.value === "authenticated" && session.value?.user) {
    // OAuth user is authenticated and auto-verified
    // They're good to go
    return;
  }

  // For manual login users, verify JWT token
  try {
    const user: any = await $fetch("/api/auth/user", {
      credentials: "include",
    });

    // If user is null, they're not logged in
    if (!user) {
      return navigateTo("/auth/login");
    }

    // User not verified - redirect to verification pending with email
    if (!user.isVerified) {
      return navigateTo(
        `/auth/verification-pending?email=${encodeURIComponent(user.email)}`,
      );
    }

    // User is verified - allow access (no redirect)
  } catch (error) {
    // Error fetching user - redirect to login
    return navigateTo("/auth/login");
  }
});

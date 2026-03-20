export function useLogout() {
  const { signOut, data: session } = useAuth();

  const logout = async () => {
    // Clear user data first
    const userProfile = useState("userProfile");
    const username = useState("username");
    const navbarLoading = useState("navbarLoading");

    userProfile.value = null;
    username.value = "User";
    navbarLoading.value = true;

    try {
      // Call server logout endpoint (handles JWT cookies)
      await $fetch("/api/auth/logout", { method: "POST" });

      // For OAuth users, use NextAuth signOut with redirect: false to avoid navigation issues
      if (session.value) {
        await signOut({ redirect: false });
        // Manual redirect after signOut completes
        await navigateTo("/auth/login");
      } else {
        // JWT users just redirect
        await navigateTo("/auth/login");
      }
    } catch (error) {
      // Force redirect to login even on error
      await navigateTo("/auth/login");
    }
  };

  return { logout };
}

export function useLogout() {
  const { signOut } = useAuth();

  const logout = async () => {
    try {
      // Clear JWT cookie (manual login) and OAuth session
      await $fetch("/api/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/auth/login" });

      // Clear cached user data
      const userProfile = useState("userProfile");
      const username = useState("username");
      const navbarLoading = useState("navbarLoading");

      userProfile.value = null;
      username.value = "User";
      navbarLoading.value = true;
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to login even if there's an error
      await signOut({ callbackUrl: "/auth/login" });
    }
  };

  return { logout };
}

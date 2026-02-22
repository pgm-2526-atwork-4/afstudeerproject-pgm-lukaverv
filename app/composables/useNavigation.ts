export function useNavigation() {
  const router = useRouter();

  // Navigate back using browser history
  const goBack = () => {
    router.back();
  };

  // Redirect to login page
  const redirectToLogin = () => {
    router.push("/auth/login");
  };

  return { goBack, redirectToLogin };
}

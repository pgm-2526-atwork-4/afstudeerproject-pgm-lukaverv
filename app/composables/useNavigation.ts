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

  const navigateToBeat = (beatId: any) => {
    router.push(`/beat/${beatId}`);
  };

  return { goBack, redirectToLogin, navigateToBeat };
}

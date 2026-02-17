export function useRedirectToLogin() {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/auth/login");
  };

  return { redirectToLogin };
}
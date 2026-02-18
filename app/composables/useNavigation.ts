export function useNavigation() {
  const router = useRouter();

  // Navigate back using browser history
  const goBack = () => {
    router.back();
  };

  return { goBack };
}

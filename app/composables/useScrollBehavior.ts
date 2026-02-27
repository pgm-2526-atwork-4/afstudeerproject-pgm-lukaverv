export function useScrollBehavior() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    scrollToTop,
  };
}

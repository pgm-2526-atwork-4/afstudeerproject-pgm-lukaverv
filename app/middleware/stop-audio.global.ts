/**
 * Global middleware to stop audio playback when navigating to auth, dashboard,
 * settings, shop (cart/checkout), or downloads pages to ensure a clean UX in those contexts.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only run on client-side (audio store is client-only)
  if (import.meta.client) {
    const shouldStop =
      to.path.startsWith("/auth/") ||
      to.path.startsWith("/dashboard") ||
      to.path.startsWith("/settings") ||
      to.path.startsWith("/shop/") ||
      to.path.startsWith("/downloads");

    if (shouldStop) {
      const audioStore = useAudioStore();
      audioStore.stop();
    }
  }
});

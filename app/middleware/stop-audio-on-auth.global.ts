/**
 * Global middleware to stop audio playback when navigating to auth pages
 * This ensures a clean UX - no music playing during login/signup flows
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only run on client-side (audio store is client-only)
  if (import.meta.client) {
    // Check if navigating to any auth page
    if (to.path.startsWith("/auth/")) {
      const audioStore = useAudioStore();
      audioStore.stop();
    }
  }
});

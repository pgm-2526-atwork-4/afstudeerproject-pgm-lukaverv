/**
 * Composable for reactive like state, shared across all components via a global
 * store keyed by beatId. This means AudioPlayer and beat detail page automatically
 * stay in sync when either one toggles a like.
 */
export const useLikes = (beatId: Ref<string> | string) => {
  const beatIdRef = isRef(beatId) ? beatId : ref(beatId as string);

  // Global store keyed by beatId — shared across all component instances
  const likeStore = useState<Record<string, { liked: boolean; count: number }>>(
    "likeStore",
    () => ({}),
  );

  const userProfile = useState<any>("userProfile");

  // Ensure an entry exists for this beatId
  const ensure = () => {
    if (!likeStore.value[beatIdRef.value]) {
      likeStore.value[beatIdRef.value] = { liked: false, count: 0 };
    }
  };

  // Computed refs — always reflect the latest state for the current beatId.
  // Because beatIdRef can change (AudioPlayer), these automatically point to the
  // right entry in the store.
  const isLiked = computed(
    () => likeStore.value[beatIdRef.value]?.liked ?? false,
  );
  const likeCount = computed(
    () => likeStore.value[beatIdRef.value]?.count ?? 0,
  );

  /** Seed the count from the initial beat data (to avoid an extra API call). */
  const initCount = (count: number) => {
    ensure();
    likeStore.value[beatIdRef.value]!.count = count;
  };

  /** Fetch whether the current user has liked this beat. */
  const fetchLikeStatus = async () => {
    if (!userProfile.value?.id || !beatIdRef.value) return;
    ensure();
    try {
      const status: any = await $fetch("/api/interactions/likes/check", {
        params: { beatId: beatIdRef.value, profileId: userProfile.value.id },
      });
      likeStore.value[beatIdRef.value]!.liked = status.liked;
    } catch (e) {
      console.error("Failed to fetch like status:", e);
    }
  };

  /** Toggle like / unlike. Updates the shared store so all components react. */
  const toggleLike = async () => {
    if (!userProfile.value?.id || !beatIdRef.value) return;
    ensure();
    try {
      const response: any = await $fetch("/api/interactions/likes/toggle", {
        method: "POST",
        body: { beatId: beatIdRef.value, profileId: userProfile.value.id },
      });
      likeStore.value[beatIdRef.value]!.liked = response.liked;
      likeStore.value[beatIdRef.value]!.count += response.liked ? 1 : -1;
    } catch (e) {
      console.error("Failed to toggle like:", e);
    }
  };

  return { isLiked, likeCount, initCount, fetchLikeStatus, toggleLike };
};

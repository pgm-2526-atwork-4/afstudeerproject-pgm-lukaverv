<template>
  <div class="min-h-screen pt-16 bg-gradient-to-b from-[#0f1219] to-[#0a0d14]">
    <!-- Back Button -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton />
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div class="animate-pulse">
        <div class="grid lg:grid-cols-[320px_1fr] gap-8">
          <!-- Sidebar Skeleton -->
          <div class="space-y-6">
            <div class="aspect-square bg-gray-800 rounded-xl"></div>
            <div class="h-8 bg-gray-800 rounded w-3/4"></div>
            <div class="h-6 bg-gray-800 rounded w-1/2"></div>
          </div>
          <!-- Content Skeleton -->
          <div class="space-y-6">
            <div class="grid md:grid-cols-3 gap-4">
              <div class="h-48 bg-gray-800 rounded-xl"></div>
              <div class="h-48 bg-gray-800 rounded-xl"></div>
              <div class="h-48 bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <Icon
        name="ph:warning-circle"
        class="text-red-400 text-6xl mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-white mb-2">Beat Not Found</h2>
      <p class="text-gray-400 mb-6">
        The beat you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink
        to="/discover"
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
      >
        <Icon name="ph:arrow-left" size="20" />
        Back to Discover
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div
      v-else-if="beat"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div class="grid lg:grid-cols-[320px_1fr] gap-8">
        <!-- Left Sidebar -->
        <div class="space-y-6 lg:sticky lg:top-32">
          <!-- Beat Cover Image -->
          <div class="relative group">
            <img
              :src="beat.coverImage"
              :alt="beat.title"
              class="w-full aspect-square rounded-xl object-cover"
            />
            <!-- Waveform animation when playing -->
            <div
              v-if="playingBeatId === String(beat.id) && isPlaying"
              @click="togglePlay(beat)"
              class="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center cursor-pointer"
            >
              <div class="flex items-end gap-1.5 h-16">
                <div
                  class="w-2 bg-blue-400 rounded-full animate-eq-bar-1"
                ></div>
                <div
                  class="w-2 bg-blue-400 rounded-full animate-eq-bar-2"
                ></div>
                <div
                  class="w-2 bg-blue-400 rounded-full animate-eq-bar-3"
                ></div>
                <div
                  class="w-2 bg-blue-400 rounded-full animate-eq-bar-2"
                ></div>
                <div
                  class="w-2 bg-blue-400 rounded-full animate-eq-bar-1"
                ></div>
              </div>
            </div>
            <!-- Play Button Overlay -->
            <div
              v-else
              @click="togglePlay(beat)"
              class="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div
                class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Icon name="ph:play-fill" class="text-white text-3xl ml-1" />
              </div>
            </div>
          </div>

          <!-- Beat Title & Producer -->
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
              {{ beat.title }}
            </h1>
            <NuxtLink
              :to="`/profile/${beat.producerUserId}`"
              class="text-gray-400 hover:text-blue-400 transition-colors text-lg"
            >
              {{ beat.producer }}
            </NuxtLink>
            <p v-if="beat.createdAt" class="text-gray-500 text-sm mt-1">
              Released {{ formatDate(beat.createdAt) }}
            </p>
          </div>

          <!-- Interaction Buttons -->
          <div class="flex gap-4">
            <button
              @click="userProfile ? handleLikeToggle() : redirectToLogin"
              :class="
                isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              "
              class="flex items-center gap-2 transition-colors"
            >
              <Icon
                :name="isLiked ? 'ph:heart-fill' : 'ph:heart'"
                class="text-2xl"
              />
              <span class="text-sm font-semibold">{{
                formatNumber(likeCount)
              }}</span>
            </button>

            <button
              class="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Icon name="ph:chat-circle" class="text-2xl" />
              <span class="text-sm font-semibold">{{
                comments?.length ?? beat?.commentsCount ?? 0
              }}</span>
            </button>

            <div class="flex items-center gap-2 text-gray-400">
              <Icon name="ph:play-fill" class="text-2xl" />
              <span class="text-sm font-semibold">{{
                formatNumber(beat?.playsCount ?? 0)
              }}</span>
            </div>
          </div>

          <!-- Beat Details Table -->
          <div
            class="bg-[#161b33] rounded-xl overflow-hidden border border-gray-700/30"
          >
            <div class="grid grid-cols-2 divide-x divide-y divide-gray-700/30">
              <!-- BPM -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  BPM
                </div>
                <div class="text-xl font-bold text-white">{{ beat.bpm }}</div>
              </div>

              <!-- Key -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Key
                </div>
                <div class="text-xl font-bold text-white">{{ beat.key }}</div>
              </div>

              <!-- Time -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Time
                </div>
                <div class="text-xl font-bold text-white">
                  {{ beat.duration }}
                </div>
              </div>

              <!-- Genre -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Genre
                </div>
                <div class="text-xl font-bold text-white">{{ beat.genre }}</div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
            >
              Tags
            </h3>
            <div
              v-if="beat.tags && beat.tags.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="tag in beat.tags"
                :key="tag"
                class="px-3 py-1.5 text-sm font-medium bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/30"
              >
                #{{ tag.toLowerCase() }}
              </span>
            </div>
            <p v-else class="text-gray-500 text-sm italic">No tags added.</p>
          </div>

          <!-- Track Description -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
            >
              Track Description
            </h3>
            <p v-if="beat.description" class="text-gray-300 leading-relaxed">
              {{ beat.description }}
            </p>
            <p v-else class="text-gray-500 text-sm italic">
              No description added.
            </p>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="space-y-8">
          <!-- License Options -->
          <div>
            <div class="grid md:grid-cols-3 gap-4 mb-8">
              <!-- Basic License -->
              <button
                @click="selectedLicense = 'basic'"
                :class="
                  selectedLicense === 'basic'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'basic'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">Basic License</h3>
                <p class="text-xs text-gray-400 mb-4">(TAGGED MP3)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.priceBasic.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">MP3</p>
              </button>

              <!-- Premium License -->
              <button
                @click="selectedLicense = 'premium'"
                :class="
                  selectedLicense === 'premium'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'premium'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">
                  Premium License
                </h3>
                <p class="text-xs text-gray-400 mb-4">(UNTAGGED WAV + MP3)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.pricePremium.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">WAV, MP3</p>
              </button>

              <!-- Exclusive License -->
              <button
                @click="selectedLicense = 'exclusive'"
                :class="
                  selectedLicense === 'exclusive'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'exclusive'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">
                  Exclusive License
                </h3>
                <p class="text-xs text-gray-400 mb-4">(EXCLUSIVE RIGHTS)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.priceExclusive.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">WAV, MP3</p>
              </button>
            </div>

            <!-- Usage Terms -->
            <div
              class="bg-[#161b33] rounded-xl p-6 border border-gray-700/30 mb-6"
            >
              <h3 class="text-xl font-bold text-white mb-6">Usage Terms</h3>
              <div class="text-lg font-semibold text-blue-400 mb-6">
                {{ selectedLicenseLabel }}
              </div>

              <div class="grid md:grid-cols-3 gap-6">
                <!-- Streaming -->
                <div class="flex items-start gap-3">
                  <Icon
                    name="ph:play-circle"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.streams }}
                    </p>
                    <p class="text-sm text-gray-400">streams</p>
                  </div>
                </div>

                <!-- Monetization -->
                <div class="flex items-start gap-3">
                  <Icon
                    name="ph:currency-dollar-simple"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.monetization }}
                    </p>
                    <p class="text-sm text-gray-400">for streaming platforms</p>
                  </div>
                </div>

                <!-- Exclusivity -->
                <div class="flex items-start gap-3">
                  <Icon
                    :name="
                      usageTerms.exclusive ? 'ph:check-circle' : 'ph:x-circle'
                    "
                    :class="
                      usageTerms.exclusive ? 'text-green-400' : 'text-red-400'
                    "
                    class="flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.exclusiveText }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ usageTerms.exclusiveSubtext }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="!userProfile ? redirectToLogin() : addToCart()"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <Icon name="ph:shopping-cart" size="24" />
              Add to cart
            </button>
          </div>

          <!-- More from Producer Section -->
          <div v-if="producerBeats && producerBeats.length > 0">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">
                More from {{ beat.producer }}
              </h2>
              <NuxtLink
                :to="`/producer/${beat.producerId}/all-tracks`"
                class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                See all
                <Icon name="ph:arrow-right" size="16" />
              </NuxtLink>
            </div>

            <!-- Beats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                v-for="producerBeat in producerBeats"
                :key="producerBeat.id"
                class="group"
              >
                <div class="relative mb-3">
                  <img
                    :src="producerBeat.coverImage"
                    :alt="producerBeat.title"
                    class="w-full aspect-square rounded-lg object-cover"
                  />
                  <!-- Waveform animation when playing -->
                  <div
                    v-if="
                      playingBeatId === String(producerBeat.id) && isPlaying
                    "
                    @click.stop="togglePlay(producerBeat)"
                    class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <div class="flex items-end gap-1 h-10">
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-1"
                      ></div>
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-2"
                      ></div>
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-3"
                      ></div>
                    </div>
                  </div>
                  <!-- Play button overlay -->
                  <div
                    v-else
                    @click.stop="togglePlay(producerBeat)"
                    class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div
                      class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Icon
                        name="ph:play-fill"
                        class="text-white text-xl ml-0.5"
                      />
                    </div>
                  </div>
                </div>
                <NuxtLink :to="`/beat/${producerBeat.id}`">
                  <h3
                    class="text-white font-bold text-sm mb-1 truncate hover:text-blue-400 transition-colors"
                  >
                    {{ producerBeat.title }}
                  </h3>
                </NuxtLink>
                <p class="text-gray-400 text-sm">${{ producerBeat.price }}</p>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="bg-[#1a1f35]/40 rounded-xl p-6 border border-gray-700/30">
            <h3 class="text-xl font-bold text-white mb-6">Comments</h3>

            <!-- Comment Form (logged in) or login prompt (guest) -->
            <div class="mb-6 pb-6 border-b border-gray-700/30">
              <template v-if="userProfile">
                <textarea
                  v-model="newComment"
                  placeholder="Add a comment..."
                  class="w-full bg-[#0f1219]/50 text-white placeholder-gray-500 rounded-lg p-4 border border-gray-700/30 focus:border-blue-500 outline-none transition-colors resize-none"
                  rows="3"
                ></textarea>
                <button
                  @click="addComment"
                  :disabled="!newComment.trim() || postingComment"
                  class="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {{ postingComment ? "Posting..." : "Post Comment" }}
                </button>
              </template>
              <p v-else class="text-gray-400 text-sm">
                Want to join the conversation?
                <NuxtLink
                  to="/auth/login"
                  class="text-blue-400 hover:text-blue-300 font-semibold"
                  >Log in</NuxtLink
                >
                to post a comment.
              </p>
            </div>

            <!-- Comments List -->
            <div class="space-y-4">
              <div v-for="comment in comments" :key="comment.id">
                <div class="flex items-start gap-3">
                  <NuxtLink
                    :to="`/profile/${comment.authorUserId}`"
                    class="flex-shrink-0"
                  >
                    <img
                      v-if="comment.authorPicture"
                      :src="comment.authorPicture"
                      :alt="comment.author"
                      class="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                    <div
                      v-else
                      class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <Icon
                        name="mdi:account-circle"
                        class="w-6 h-6 text-gray-400"
                      />
                    </div>
                  </NuxtLink>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <div class="flex items-center gap-2">
                        <NuxtLink
                          :to="`/profile/${comment.authorUserId}`"
                          class="text-white font-semibold text-sm hover:text-blue-400 transition-colors"
                        >
                          {{ comment.author }}
                        </NuxtLink>
                        <p class="text-xs text-gray-500">
                          {{ new Date(comment.createdAt).toLocaleDateString() }}
                        </p>
                      </div>
                      <button
                        v-if="userProfile?.id === comment.profileId"
                        @click="deleteComment(comment.id)"
                        class="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Delete comment"
                      >
                        <Icon name="ph:trash" size="16" />
                      </button>
                    </div>
                    <p class="text-gray-300 text-sm leading-relaxed">
                      {{ comment.text }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="!comments?.length" class="text-center py-8">
                <p class="text-gray-400 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Beat",
});

const route = useRoute();
const beatId = route.params.id;

// Fetch beat details
const { data: beat, pending, error } = await useFetch(`/api/beats/${beatId}`);

// Set dynamic title based on beat data
usePageTitle(() => beat.value?.title, "Beat");

// Fetch more beats from the same producer using the dedicated endpoint
const { data: producerData } = await useFetch(
  computed(() =>
    beat.value?.producerId
      ? `/api/producers/${beat.value.producerId}/beats`
      : null,
  ),
);

const producerBeats = computed(() => {
  if (!producerData.value?.beats) return [];
  return producerData.value.beats
    .filter((b) => b.id !== beat.value?.id)
    .slice(0, 5);
});

// Sync producer beats to audio player playlist
usePlaylistSync(producerBeats);

const { playingBeatId, isPlaying, togglePlay } = useBeatPlayer();
const { getLicenseLabel, getUsageTerms } = useLicenseData();

// License selection
const selectedLicense = ref("basic");
const selectedLicenseLabel = computed(() =>
  getLicenseLabel(selectedLicense.value),
);
const usageTerms = computed(() => getUsageTerms(selectedLicense.value));

// Likes — shared state with the AudioPlayer via useLikes keyed by beatId
const userProfile = useState("userProfile");
const {
  isLiked,
  likeCount,
  initCount,
  fetchLikeStatus,
  toggleLike: handleLikeToggle,
} = useLikes(beatId);
const { formatNumber, formatDate } = useFormatters();

// Seed like count from initial beat data (avoids an extra API call)
watch(
  beat,
  (newBeat) => {
    if (newBeat?.likesCount !== undefined) initCount(newBeat.likesCount);
  },
  { immediate: true },
);

const { redirectToLogin } = useNavigation();

onMounted(() => {
  fetchLikeStatus();
});

// Comments - use local ref for optimistic updates
const { data: fetchedComments, refresh: refreshComments } = await useFetch(
  `/api/interactions/comments/${beatId}`,
);
const comments = ref(fetchedComments.value || []);

// Keep comments in sync with fetched data
watch(fetchedComments, (newComments) => {
  if (newComments) comments.value = newComments;
});

const newComment = ref("");
const postingComment = ref(false);

const addComment = async () => {
  if (!userProfile.value?.id) return navigateTo("/login");
  if (!newComment.value.trim()) return;
  postingComment.value = true;
  try {
    await $fetch("/api/interactions/comments", {
      method: "POST",
      body: { beatId, profileId: userProfile.value.id, text: newComment.value },
    });
    newComment.value = "";
    await refreshComments();
  } catch (e) {
    console.error("Failed to post comment:", e);
  } finally {
    postingComment.value = false;
  }
};

const deleteComment = async (commentId) => {
  if (!userProfile.value?.id) return;
  // Optimistically remove from local list immediately
  comments.value = comments.value.filter((c) => c.id !== commentId);

  try {
    await $fetch(`/api/interactions/comments/${commentId}`, {
      method: "DELETE",
      query: { profileId: userProfile.value.id },
    });
  } catch (e) {
    console.error("Failed to delete comment:", e);
    // Restore from server on error
    await refreshComments();
  }
};
</script>

<style scoped>
/* Animated Equalizer Bars */
@keyframes eq-bar-1 {
  0%,
  100% {
    height: 16px;
  }
  50% {
    height: 40px;
  }
}

@keyframes eq-bar-2 {
  0%,
  100% {
    height: 24px;
  }
  50% {
    height: 52px;
  }
}

@keyframes eq-bar-3 {
  0%,
  100% {
    height: 20px;
  }
  50% {
    height: 48px;
  }
}

.animate-eq-bar-1 {
  animation: eq-bar-1 0.6s ease-in-out infinite;
}

.animate-eq-bar-2 {
  animation: eq-bar-2 0.8s ease-in-out infinite;
  animation-delay: 0.1s;
}

.animate-eq-bar-3 {
  animation: eq-bar-3 0.7s ease-in-out infinite;
  animation-delay: 0.2s;
}
</style>

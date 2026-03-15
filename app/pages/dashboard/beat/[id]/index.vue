<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-model="showDeleteModal"
      title="Delete Beat?"
      message="This action cannot be undone. All stats and data will be permanently removed."
      :item-name="beat?.title"
      confirm-text="Delete Beat"
      @confirm="confirmDelete"
    />

    <!-- Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-6 sm:py-8 md:py-12 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton label="Back to Dashboard" to="/dashboard" class="mb-4" />

        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <!-- Beat Artwork -->
          <div class="flex-shrink-0 w-full sm:w-auto">
            <img
              :src="beat?.coverImage"
              :alt="beat?.title"
              class="w-full sm:w-40 md:w-48 aspect-square rounded-lg object-cover shadow-2xl"
            />
          </div>

          <!-- Beat Info -->
          <div class="flex-1 min-w-0 w-full">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3"
            >
              {{ beat?.title }}
            </h1>
            <p
              class="text-sm sm:text-base md:text-lg text-gray-300 mb-3 md:mb-4"
            >
              {{ beat?.description || "No description provided" }}
            </p>

            <p
              v-if="beat?.createdAt"
              class="text-xs text-gray-500 mb-3 flex items-center gap-1.5"
            >
              <Icon name="ph:calendar" size="13" />
              Posted {{ formatDate(beat.createdAt) }}
            </p>

            <div class="flex flex-wrap gap-2 md:gap-3 mb-4">
              <span
                class="px-2.5 md:px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-xs md:text-sm"
              >
                {{ beat?.bpm }} BPM
              </span>
              <span
                class="px-2.5 md:px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-xs md:text-sm"
              >
                {{ beat?.key }}
              </span>
              <span
                class="px-2.5 md:px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-xs md:text-sm"
              >
                {{ beat?.genre }}
              </span>
              <span
                v-for="tag in beat?.tags || []"
                :key="tag"
                class="px-2.5 md:px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs md:text-sm"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2 md:gap-3">
              <NuxtLink
                :to="`/dashboard/beat/${beatId}/edit`"
                class="px-4 md:px-6 py-2 md:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm md:text-base"
              >
                <Icon name="ph:pencil-simple" class="w-4 h-4 md:w-5 md:h-5" />
                <span class="hidden sm:inline">Edit Beat</span>
                <span class="sm:hidden">Edit</span>
              </NuxtLink>
              <NuxtLink
                :to="`/beat/${beatId}`"
                target="_blank"
                class="px-4 md:px-6 py-2 md:py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm md:text-base"
              >
                <Icon name="ph:eye" class="w-4 h-4 md:w-5 md:h-5" />
                <span class="hidden sm:inline">View Public Page</span>
                <span class="sm:hidden">View</span>
              </NuxtLink>
              <button
                @click="showDeleteModal = true"
                class="px-4 md:px-6 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm md:text-base"
              >
                <Icon name="ph:trash" class="w-4 h-4 md:w-5 md:h-5" />
                <span class="hidden sm:inline">Delete Beat</span>
                <span class="sm:hidden">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats and Details -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <!-- Stats Grid -->
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
      >
        <div class="bg-dark-800 rounded-xl p-4 md:p-6 shadow-2xl">
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <Icon
              name="ph:play-fill"
              class="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0"
            />
            <span class="text-xs md:text-sm text-gray-400">Total Plays</span>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-white">
            {{ formatNumber(stats.plays) }}
          </p>
        </div>

        <div class="bg-dark-800 rounded-xl p-4 md:p-6 shadow-2xl">
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <Icon
              name="ph:heart-fill"
              class="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0"
            />
            <span class="text-xs md:text-sm text-gray-400">Likes</span>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-white">
            {{ formatNumber(stats.likes) }}
          </p>
        </div>

        <div
          class="bg-dark-800 rounded-xl p-4 md:p-6 shadow-2xl col-span-2 md:col-span-1"
        >
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <Icon
              name="ph:chat-circle-text"
              class="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0"
            />
            <span class="text-xs md:text-sm text-gray-400">Comments</span>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-white">
            {{ formatNumber(stats.comments) }}
          </p>
        </div>
      </div>

      <!-- Retention Graph -->
      <div
        class="bg-dark-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl mb-6 sm:mb-8"
      >
        <RetentionGraph
          :duration="beat?.durationSeconds ?? 180"
          :avg-view-duration="retention?.avgViewDuration ?? '0:00'"
          :avg-percentage-viewed="retention?.avgPercentageViewed ?? 0"
          :beat-retention="retention?.beatRetention ?? []"
          :typical-retention="retention?.typicalRetention ?? []"
        />
      </div>

      <!-- Engagement Tabs (Comments + Likes) -->
      <div
        class="bg-dark-800 rounded-xl shadow-2xl mb-6 sm:mb-8 overflow-hidden"
      >
        <!-- Tab Headers -->
        <div class="flex border-b border-gray-700/30">
          <button
            @click="
              activeTab = 'comments';
              commentPage = 1;
            "
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap relative outline-none select-none',
              activeTab === 'comments'
                ? 'bg-primary-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
            ]"
            :style="
              activeTab === 'comments' ? { color: 'rgb(59, 130, 246)' } : {}
            "
          >
            <Icon name="ph:chat-circle-text" class="w-4 h-4" />
            Comments
            <span
              class="ml-1 px-1.5 py-0.5 rounded-full bg-dark-600 text-xs font-normal text-gray-400"
              >{{ comments.length }}</span
            >
            <div
              v-if="activeTab === 'comments'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-slideIn"
            ></div>
          </button>
          <button
            @click="
              activeTab = 'likes';
              likerPage = 1;
            "
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap relative outline-none select-none',
              activeTab === 'likes'
                ? 'bg-primary-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
            ]"
            :style="activeTab === 'likes' ? { color: 'rgb(59, 130, 246)' } : {}"
          >
            <Icon name="ph:heart-fill" class="w-4 h-4" />
            Liked By
            <span
              class="ml-1 px-1.5 py-0.5 rounded-full bg-dark-600 text-xs font-normal text-gray-400"
              >{{ likers?.length ?? 0 }}</span
            >
            <div
              v-if="activeTab === 'likes'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-slideIn"
            ></div>
          </button>
        </div>

        <!-- Comments Panel -->
        <div v-if="activeTab === 'comments'" class="p-4 sm:p-6">
          <div v-if="comments.length === 0" class="text-center py-10">
            <Icon
              name="ph:chat-circle-text"
              class="text-4xl text-gray-600 mx-auto mb-2"
            />
            <p class="text-gray-500 text-sm">No comments yet.</p>
          </div>
          <Pagination
            v-else
            :items="comments"
            :page="commentPage"
            :items-per-page="commentPageSize"
            item-label="comments"
            :per-page-options="[10, 20]"
            @update:page="commentPage = $event"
            @update:items-per-page="commentPageSize = $event"
            v-slot="{ items: slice }"
          >
            <div class="space-y-2 mb-2">
              <div
                v-for="comment in slice as any[]"
                :key="comment.id"
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-700/40 transition-colors"
              >
                <NuxtLink
                  :to="`/profile/${comment.authorUserId}`"
                  class="flex-shrink-0"
                >
                  <img
                    v-if="comment.authorPicture"
                    :src="comment.authorPicture"
                    :alt="comment.author"
                    class="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                  />
                  <div
                    v-else
                    class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <Icon
                      name="mdi:account-circle"
                      class="w-7 h-7 text-gray-400"
                    />
                  </div>
                </NuxtLink>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <NuxtLink
                        :to="`/profile/${comment.authorUserId}`"
                        class="text-white font-semibold text-sm hover:text-blue-400 transition-colors"
                        >{{ comment.author }}</NuxtLink
                      >
                      <span class="text-xs text-gray-500">{{
                        new Date(comment.createdAt).toLocaleDateString()
                      }}</span>
                    </div>
                    <button
                      @click="deleteComment(comment.id)"
                      class="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                      title="Delete comment"
                    >
                      <Icon name="ph:trash" size="15" />
                    </button>
                  </div>
                  <p class="text-gray-300 text-sm leading-relaxed">
                    {{ comment.text }}
                  </p>
                </div>
              </div>
            </div>
          </Pagination>
        </div>

        <!-- Likes Panel -->
        <div v-if="activeTab === 'likes'" class="p-4 sm:p-6">
          <div v-if="!likers?.length" class="text-center py-10">
            <Icon name="ph:heart" class="text-4xl text-gray-600 mx-auto mb-2" />
            <p class="text-gray-500 text-sm">Nobody has liked this beat yet.</p>
          </div>
          <Pagination
            v-else
            :items="likers as any[]"
            :page="likerPage"
            :items-per-page="likerPageSize"
            item-label="likes"
            :per-page-options="[10, 20]"
            @update:page="likerPage = $event"
            @update:items-per-page="likerPageSize = $event"
            v-slot="{ items: slice }"
          >
            <div class="space-y-2 mb-2">
              <NuxtLink
                v-for="liker in slice as any[]"
                :key="liker.profileId"
                :to="`/profile/${liker.userId}`"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700/40 transition-colors"
              >
                <img
                  v-if="liker.profilePicture"
                  :src="liker.profilePicture"
                  :alt="liker.username"
                  class="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div
                  v-else
                  class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0"
                >
                  <Icon
                    name="mdi:account-circle"
                    class="w-7 h-7 text-gray-400"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold text-sm">
                    {{ liker.username }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Liked {{ new Date(liker.likedAt).toLocaleDateString() }}
                  </p>
                </div>
                <Icon name="ph:arrow-right" class="text-gray-600" size="16" />
              </NuxtLink>
            </div>
          </Pagination>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Pricing Info -->
        <div class="bg-dark-800 rounded-xl p-4 sm:p-6 shadow-2xl">
          <h2
            class="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2"
          >
            <Icon
              name="ph:currency-circle-dollar"
              class="w-4 h-4 md:w-5 md:h-5 text-primary-500"
            />
            Pricing
          </h2>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-sm md:text-base text-gray-300"
                >Basic License</span
              >
              <span class="text-sm md:text-base text-white font-bold"
                >€{{ beat?.priceBasic }}</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-sm md:text-base text-gray-300"
                >Premium License</span
              >
              <span class="text-sm md:text-base text-white font-bold"
                >€{{ beat?.pricePremium }}</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-sm md:text-base text-gray-300"
                >Exclusive License</span
              >
              <span class="text-sm md:text-base text-white font-bold"
                >€{{ beat?.priceExclusive }}</span
              >
            </div>
          </div>
        </div>

        <!-- Beat Files -->
        <div class="bg-dark-800 rounded-xl p-4 sm:p-6 shadow-2xl">
          <h2
            class="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2"
          >
            <Icon
              name="ph:music-notes"
              class="w-4 h-4 md:w-5 md:h-5 text-primary-500"
            />
            Audio Files
          </h2>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <Icon
                  name="ph:music-note"
                  class="w-4 h-4 md:w-5 md:h-5 text-primary-500 flex-shrink-0"
                />
                <span class="text-sm md:text-base text-gray-300"
                  >MP3 (Tagged)</span
                >
              </div>
              <span class="text-xs md:text-sm text-green-500 font-medium"
                >✓ Uploaded</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <Icon
                  name="ph:waveform"
                  class="w-4 h-4 md:w-5 md:h-5 text-primary-500 flex-shrink-0"
                />
                <span class="text-sm md:text-base text-gray-300"
                  >WAV (Untagged)</span
                >
              </div>
              <span class="text-xs md:text-sm text-green-500 font-medium"
                >✓ Uploaded</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "producer-only",
});

const route = useRoute();
const router = useRouter();
const beatId = route.params.id;

// Fetch the beat data
const { data: beatData, error } = await useFetch(`/api/beats/${beatId}`, {
  headers: useRequestHeaders(["cookie"]),
});

// If the beat doesn't exist or error, redirect to dashboard
if (error.value || !beatData.value) {
  navigateTo("/dashboard");
}

const beat = beatData.value as any;

// Use real stats from the beat data
const stats = computed(() => ({
  plays: beat?.playsCount || 0,
  likes: beat?.likesCount || 0,
  comments: beat?.commentsCount || 0,
}));

const { formatNumber, formatDate } = useFormatters();

// Retention graph data
const { data: retention } = await useFetch(
  `/api/dashboard/retention/${beatId}`,
  { headers: useRequestHeaders(["cookie"]) },
);

const userProfile = useState<any>("userProfile");

// Comments
const { data: fetchedComments, refresh: refreshComments } = await useFetch(
  `/api/interactions/comments/${beatId}`,
);
const comments = ref((fetchedComments.value as any[]) || []);
watch(fetchedComments, (val) => {
  if (val) comments.value = val as any[];
});

const deleteComment = async (commentId: string) => {
  comments.value = comments.value.filter((c: any) => c.id !== commentId);
  try {
    await $fetch(`/api/interactions/comments/${commentId}`, {
      method: "DELETE",
      query: { profileId: userProfile.value?.id },
    });
  } catch {
    await refreshComments();
  }
};

// Likers
const { data: likers } = await useFetch(`/api/beats/${beatId}/likers`);

// Engagement tabs + pagination
const activeTab = ref<"comments" | "likes">("comments");
const commentPage = ref(1);
const commentPageSize = ref(10);
const likerPage = ref(1);
const likerPageSize = ref(10);

// Delete modal
const showDeleteModal = ref(false);

const confirmDelete = async () => {
  try {
    await $fetch(`/api/beats/${beatId}`, { method: "DELETE" });
    showDeleteModal.value = false;
    router.push("/dashboard?tab=tracks");
  } catch (err: any) {
    alert(err?.data?.message || "Failed to delete beat. Please try again.");
  }
};
</script>

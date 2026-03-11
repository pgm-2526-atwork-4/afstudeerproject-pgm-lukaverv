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
              name="ph:play-circle"
              class="w-4 h-4 md:w-5 md:h-5 text-primary-500 flex-shrink-0"
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
          :avg-view-duration="avgViewDuration"
          :avg-percentage-viewed="avgPercentageViewed"
        />
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
  plays: beat?.playCount || 0,
  likes: beat?.likesCount || 0,
  comments: beat?.commentsCount || 0,
}));

// Number formatting
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Retention graph data (also hardcoded for now)
const avgViewDuration = "1:45";
const avgPercentageViewed = 58;

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

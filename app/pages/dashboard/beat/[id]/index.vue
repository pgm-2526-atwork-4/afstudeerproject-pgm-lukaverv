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
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-8 md:py-12 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton label="Back to Dashboard" to="/dashboard" class="mb-4" />

        <div class="flex flex-col md:flex-row gap-6 items-start">
          <!-- Beat Artwork -->
          <div class="flex-shrink-0">
            <img
              :src="beat?.coverImage"
              :alt="beat?.title"
              class="w-48 h-48 rounded-lg object-cover shadow-2xl"
            />
          </div>

          <!-- Beat Info -->
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
              {{ beat?.title }}
            </h1>
            <p class="text-lg text-gray-300 mb-4">
              {{ beat?.description || "No description provided" }}
            </p>

            <div class="flex flex-wrap gap-3 mb-4">
              <span
                class="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm"
              >
                {{ beat?.bpm }} BPM
              </span>
              <span
                class="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm"
              >
                {{ beat?.key }}
              </span>
              <span
                class="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm"
              >
                {{ beat?.genre }}
              </span>
              <span
                v-for="tag in beat?.tags || []"
                :key="tag"
                class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <NuxtLink
                :to="`/dashboard/beat/${beatId}/edit`"
                class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Beat
              </NuxtLink>
              <NuxtLink
                :to="`/beat/${beatId}`"
                target="_blank"
                class="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Public Page
              </NuxtLink>
              <button
                @click="showDeleteModal = true"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Beat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats and Details -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-dark-800 rounded-xl p-6 shadow-2xl">
          <div class="flex items-center gap-3 mb-2">
            <svg
              class="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm text-gray-400">Total Plays</span>
          </div>
          <p class="text-3xl font-bold text-white">
            {{ stats.plays.toLocaleString() }}
          </p>
        </div>

        <div class="bg-dark-800 rounded-xl p-6 shadow-2xl">
          <div class="flex items-center gap-3 mb-2">
            <svg
              class="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            <span class="text-sm text-gray-400">Likes</span>
          </div>
          <p class="text-3xl font-bold text-white">
            {{ stats.likes.toLocaleString() }}
          </p>
        </div>

        <div class="bg-dark-800 rounded-xl p-6 shadow-2xl">
          <div class="flex items-center gap-3 mb-2">
            <svg
              class="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span class="text-sm text-gray-400">Comments</span>
          </div>
          <p class="text-3xl font-bold text-white">
            {{ stats.comments.toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- Retention Graph -->
      <RetentionGraph
        class="mb-8"
        :duration="beat?.durationSeconds ?? 180"
        :avg-view-duration="avgViewDuration"
        :avg-percentage-viewed="avgPercentageViewed"
      />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pricing Info -->
        <div class="bg-dark-800 rounded-xl p-6 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pricing
          </h2>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-gray-300">Basic License</span>
              <span class="text-white font-bold">€{{ beat?.priceBasic }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-gray-300">Premium License</span>
              <span class="text-white font-bold"
                >€{{ beat?.pricePremium }}</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <span class="text-gray-300">Exclusive License</span>
              <span class="text-white font-bold"
                >€{{ beat?.priceExclusive }}</span
              >
            </div>
          </div>
        </div>

        <!-- Beat Files -->
        <div class="bg-dark-800 rounded-xl p-6 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            Audio Files
          </h2>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span class="text-gray-300">MP3 (Tagged)</span>
              </div>
              <span class="text-sm text-green-500">✓ Uploaded</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span class="text-gray-300">WAV (Untagged)</span>
              </div>
              <span class="text-sm text-green-500">✓ Uploaded</span>
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

// Hardcoded stats (will be made dynamic later)
const stats = ref({
  plays: 1247,
  likes: 89,
  comments: 23,
});

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

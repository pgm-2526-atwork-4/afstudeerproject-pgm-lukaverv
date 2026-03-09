<template>
  <div class="min-h-screen pt-12">
    <!-- Hero Section with Producer Info -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-[#0f1219] py-12 md:py-20 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <div class="mb-6">
          <BackButton />
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="animate-pulse text-center">
          <div class="flex justify-center mb-6">
            <div
              class="h-28 w-28 md:h-36 md:w-36 bg-gray-800 rounded-full"
            ></div>
          </div>
          <div class="h-8 bg-gray-800 rounded w-64 mx-auto mb-4"></div>
          <div class="h-12 bg-gray-800 rounded w-full max-w-4xl mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-10">
          <Icon
            name="ph:warning-circle"
            class="text-red-400 text-6xl mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-white mb-2">Producer Not Found</h2>
          <p class="text-gray-400 mb-4">
            The producer you're looking for doesn't exist or has been removed.
          </p>
          <NuxtLink
            to="/discover"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            <Icon name="ph:arrow-left" size="20" />
            Back to Discover
          </NuxtLink>
        </div>

        <!-- Producer Info -->
        <div v-else-if="data" class="text-center">
          <!-- Profile Picture -->
          <div class="flex justify-center mb-4">
            <img
              :src="data.producer.profilePicture"
              :alt="`${data.producer.username}`"
              class="h-28 w-28 md:h-44 md:w-44 rounded-full object-cover border-4 border-blue-500/20 shadow-xl"
            />
          </div>

          <!-- Username -->
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
          >
            @{{ data.producer.username }}
          </h1>

          <!-- Bio if available -->
          <p
            v-if="data.producer.bio"
            class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6"
          >
            {{ data.producer.bio }}
          </p>

          <!-- Stats -->
          <div class="flex items-center justify-center gap-6 mb-8">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-blue-400">
                {{ data.beats?.length || 0 }}
              </div>
              <div class="text-sm text-gray-400 font-medium">
                {{ data.beats?.length === 1 ? "Track" : "Tracks" }}
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <SearchInput v-model="searchQuery" />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div
      v-if="data && !pending && !error"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
    >
      <div>
        <!-- Header with Track Count -->
        <div class="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
              All Tracks by @{{ data.producer.username }}
            </h2>
            <p class="text-sm md:text-base text-gray-400">
              {{ filteredBeats.length }}
              {{ filteredBeats.length === 1 ? "track" : "tracks" }}
              {{ searchQuery ? "found" : "available" }}
            </p>
          </div>
        </div>

        <!-- Beats List Component -->
        <BeatsList
          :beats="filteredBeats"
          v-model:current-page="currentPage"
          :search-query="searchQuery"
          :show-producer="false"
          :pending="pending"
          :has-beats="data.beats && data.beats.length > 0"
          empty-message="This producer hasn't published any beats yet."
          @clear-search="searchQuery = ''"
          @open-license-modal="openLicenseModal"
        />
      </div>
    </div>

    <BackToTop />

    <!-- License Modal -->
    <BeatLicenseModal
      v-if="selectedBeat"
      :is-open="isModalOpen"
      :beat="selectedBeat"
      @close="closeLicenseModal"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const producerId = route.params.id;

// Fetch producer and their beats
const { data, pending, error } = await useFetch(
  `/api/producers/${producerId}/beats`,
);

// Modal state
const isModalOpen = ref(false);
const selectedBeat = ref(null);

const openLicenseModal = (beat) => {
  selectedBeat.value = beat;
  isModalOpen.value = true;
};

const closeLicenseModal = () => {
  isModalOpen.value = false;
  selectedBeat.value = null;
};

// Pagination
const currentPage = ref(1);

// Search query
const searchQuery = ref("");

// Filtered beats based on search query
const filteredBeats = computed(() => {
  if (!data.value?.beats) return [];

  let result = data.value.beats;

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((beat) => {
      // Search in title
      const matchesTitle = beat.title.toLowerCase().includes(query);

      // Search in genre
      const matchesGenre = beat.genre.toLowerCase().includes(query);

      // Search in tags
      const matchesTags = beat.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );

      return matchesTitle || matchesGenre || matchesTags;
    });
  }

  return result;
});

// Reset to page 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Sync filtered beats to audio player playlist
usePlaylistSync(filteredBeats);
</script>

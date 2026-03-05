<template>
  <div class="min-h-screen pt-16">
    <!-- Hero Section with Search -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-[#0f1219] py-24 md:py-32 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Large Header -->
        <div class="text-center mb-12">
          <h1
            class="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
          >
            DISCOVER BEATS
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Discover premium quality beats for your next hit. Search, filter,
            and find the perfect sound.
          </p>
        </div>

        <!-- Search Bar -->
        <SearchInput v-model="searchQuery" />

        <!-- Filter Buttons -->
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
            <!-- Genre Filter -->
            <FilterDropdown
              label="Genre"
              :options="genres"
              :selected-values="selectedFilters.genre"
              :is-open="openFilter === 'genre'"
              default-icon="ph:music-notes-simple"
              @toggle="toggleFilter('genre')"
              @select="toggleSelection('genre', $event)"
            />

            <!-- BPM Filter -->
            <FilterDropdown
              label="BPM"
              :options="bpmRanges"
              :selected-values="selectedFilters.bpm"
              :is-open="openFilter === 'bpm'"
              default-icon="ph:metronome"
              value-key="label"
              label-key="label"
              @toggle="toggleFilter('bpm')"
              @select="toggleSelection('bpm', $event)"
            />

            <!-- Key Filter -->
            <div class="col-span-2 md:col-span-1">
              <FilterDropdown
                label="Key"
                :options="musicalKeys"
                :selected-values="selectedFilters.key"
                :is-open="openFilter === 'key'"
                default-icon="ph:musical-note"
                grid-cols="grid-cols-2"
                @toggle="toggleFilter('key')"
                @select="toggleSelection('key', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <StickySearchHeader />

    <!-- Results Section -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Error State -->
      <div v-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">
          Failed to load beats. Please try again.
        </p>
      </div>

      <!-- Content or Loading -->
      <div v-else>
        <!-- Header -->
        <div
          class="mb-6 md:mb-8 flex items-start md:items-center justify-between flex-col md:flex-row gap-3 md:gap-4"
        >
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
              Browse Beats
            </h2>
            <p class="text-sm md:text-base text-gray-400">
              <template v-if="!pending">
                {{ filteredBeats.length }}
                {{ filteredBeats.length === 1 ? "track" : "tracks" }}
                {{ searchQuery ? "found" : "available" }}
              </template>
              <template v-else> Loading beats... </template>
            </p>
          </div>

          <!-- Refresh Button -->
          <button
            @click="refreshBeats"
            :disabled="pending"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Refresh beats"
          >
            <Icon
              name="ph:arrows-clockwise"
              size="18"
              :class="
                pending
                  ? 'animate-spin'
                  : 'group-hover:rotate-180 transition-transform duration-500'
              "
            />
            <span class="text-sm font-medium">Refresh</span>
          </button>
        </div>

        <!-- Beats List Component -->
        <BeatsList
          :beats="filteredBeats"
          v-model:current-page="currentPage"
          :search-query="searchQuery"
          :show-producer="true"
          :pending="pending"
          :has-beats="beats && beats.length > 0"
          empty-message="No beats available at the moment."
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
definePageMeta({
  middleware: "require-verification",
});

// Fetch beats from API
const {
  data: beats,
  pending,
  error,
  refresh: refreshBeats,
} = await useFetch("/api/beats");

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

// Filter state
const openFilter = ref(null);

// Selected filters state
const selectedFilters = ref({
  genre: [],
  bpm: [],
  key: [],
});

// Filtered beats based on search query
const filteredBeats = computed(() => {
  if (!beats.value) return [];

  let result = beats.value;

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((beat) => {
      // Search in title
      const matchesTitle = beat.title.toLowerCase().includes(query);

      // Search in producer
      const matchesProducer = beat.producer.toLowerCase().includes(query);

      // Search in genre
      const matchesGenre = beat.genre.toLowerCase().includes(query);

      // Search in tags
      const matchesTags = beat.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );

      return matchesTitle || matchesProducer || matchesGenre || matchesTags;
    });
  }

  return result;
});

// Toggle filter dropdown
const toggleFilter = (filterName) => {
  if (openFilter.value === filterName) {
    openFilter.value = null;
  } else {
    openFilter.value = filterName;
  }
};

// Toggle selection in filters
const toggleSelection = (filterType, value) => {
  const index = selectedFilters.value[filterType].indexOf(value);
  if (index > -1) {
    selectedFilters.value[filterType].splice(index, 1);
  } else {
    selectedFilters.value[filterType].push(value);
  }
};

// Reset to page 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Close filters when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      openFilter.value = null;
    }
  });
});
</script>

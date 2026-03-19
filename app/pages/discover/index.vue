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
        <SearchInput
          v-model="searchQuery"
          :has-active-filters="hasActiveFilters"
        />

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
            <BpmRangeFilter
              :min-bpm="bpmFilter.min"
              :max-bpm="bpmFilter.max"
              :is-open="openFilter === 'bpm'"
              @toggle="toggleFilter('bpm')"
              @update="updateBpmFilter"
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

    <StickySearchHeader
      v-model="searchQuery"
      :has-active-filters="hasActiveFilters"
      @clear-all="clearAll"
    />

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
                {{ searchQuery || hasActiveFilters ? "found" : "available" }}
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
          :has-active-filters="hasActiveFilters"
          empty-message="No beats available at the moment."
          @clear-search="clearAll"
          @open-license-modal="openLicenseModal"
        />
      </div>
    </div>

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
import { genres, bpmLimits, musicalKeys } from "~/data/filterData";

definePageMeta({
  title: "Discover",
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

// BPM range filter state
const bpmFilter = ref({
  min: null,
  max: null,
});

const updateBpmFilter = ({ min, max }) => {
  bpmFilter.value.min = min;
  bpmFilter.value.max = max;
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    selectedFilters.value.genre.length > 0 ||
    bpmFilter.value.min !== null ||
    bpmFilter.value.max !== null ||
    selectedFilters.value.key.length > 0
  );
});

// Filtered beats based on search query and filters
const filteredBeats = computed(() => {
  if (!beats.value) return [];

  let result = beats.value;

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((beat) => {
      const matchesTitle = beat.title.toLowerCase().includes(query);
      const matchesProducer = beat.producer.toLowerCase().includes(query);
      const matchesGenre = beat.genre.toLowerCase().includes(query);
      const matchesTags = beat.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      return matchesTitle || matchesProducer || matchesGenre || matchesTags;
    });
  }

  // Apply genre filter
  if (selectedFilters.value.genre.length > 0) {
    result = result.filter((beat) =>
      selectedFilters.value.genre.includes(beat.genre),
    );
  }

  // Apply BPM filter
  if (bpmFilter.value.min !== null || bpmFilter.value.max !== null) {
    result = result.filter((beat) => {
      const min = bpmFilter.value.min ?? bpmLimits.min;
      const max = bpmFilter.value.max ?? bpmLimits.max;
      return beat.bpm >= min && beat.bpm <= max;
    });
  }

  // Apply key filter
  if (selectedFilters.value.key.length > 0) {
    result = result.filter((beat) =>
      selectedFilters.value.key.includes(beat.key),
    );
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

// Reset to page 1 when search query or filters change
watch(
  [searchQuery, selectedFilters, bpmFilter],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);

// Clear search input and all filters
const clearAll = () => {
  searchQuery.value = "";
  selectedFilters.value = { genre: [], bpm: [], key: [] };
  bpmFilter.value = { min: null, max: null };
};

// Sync filtered beats to audio player playlist
usePlaylistSync(filteredBeats);

// Close filters when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    // Don't close if clicking on a button or inside a filter dropdown
    if (!e.target.closest("button") && !e.target.closest(".relative")) {
      openFilter.value = null;
    }
  });
});
</script>

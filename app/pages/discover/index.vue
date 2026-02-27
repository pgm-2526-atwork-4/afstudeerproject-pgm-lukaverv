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
        <div class="max-w-4xl mx-auto mb-8">
          <div class="relative mb-4 md:mb-0">
            <Icon
              name="ph:magnifying-glass"
              class="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg md:text-xl"
            />
            <input
              type="text"
              placeholder="What type of track are you looking for?"
              class="w-full pl-12 md:pl-14 pr-4 md:pr-32 py-4 md:py-5 rounded-xl text-base md:text-lg bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-lg"
            />
            <!-- Desktop button (inside input) -->
            <button
              class="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg"
            >
              SEARCH
            </button>
          </div>
          <!-- Mobile button (below input) -->
          <button
            class="md:hidden w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition font-semibold shadow-lg text-base"
          >
            SEARCH
          </button>
        </div>

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
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <p class="text-gray-400 text-lg">Loading beats...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">
          Failed to load beats. Please try again.
        </p>
      </div>

      <!-- Content -->
      <div v-else-if="beats && beats.length > 0">
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            Browse Beats
          </h2>
          <p class="text-sm md:text-base text-gray-400">
            {{ beats.length }} tracks available
          </p>
        </div>

        <!-- Column Headers Desktop -->
        <div
          class="hidden md:grid grid-cols-[2.5fr_1fr_1fr_2fr_180px] gap-6 px-4 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 flex-shrink-0"></div>
            <div>Title</div>
          </div>
          <div>Time</div>
          <div>BPM</div>
          <div>Tags</div>
          <div class="flex items-center gap-3">
            <div class="w-5"></div>
            <div>Price</div>
          </div>
        </div>

        <!-- Column Headers Mobile -->
        <div
          class="md:hidden flex justify-between items-center px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/30 mb-1"
        >
          <div>Track</div>
          <div>Price</div>
        </div>

        <!-- Pagination with Beats List -->
        <Pagination
          v-model:page="currentPage"
          :items="beats"
          :items-per-page="12"
          item-label="beats"
        >
          <template #default="{ items }">
            <div class="space-y-0">
              <div
                v-for="beat in items"
                :key="beat.id"
                @click="togglePlay(beat.id)"
                :class="
                  playingBeatId === beat.id
                    ? 'bg-blue-600/5'
                    : 'hover:bg-[#1a1f35]'
                "
                class="grid md:grid-cols-[2.5fr_1fr_1fr_2fr_180px] gap-3 md:gap-6 items-start md:items-center px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-none transition-all duration-150 cursor-pointer group"
              >
                <!-- Title Column -->
                <div
                  class="flex items-center gap-3 md:gap-4 min-w-0 col-span-full md:col-span-1"
                >
                  <div class="flex-shrink-0 relative">
                    <img
                      :src="beat.coverImage"
                      :alt="beat.title"
                      class="h-12 w-12 md:h-14 md:w-14 rounded object-cover"
                    />
                    <!-- Play/Pause Overlay -->
                    <div
                      v-if="playingBeatId === beat.id"
                      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded backdrop-blur-sm"
                    >
                      <!-- Animated Equalizer Bars When Playing -->
                      <div class="flex items-center gap-0.5 h-5">
                        <div
                          class="w-0.5 bg-blue-400 rounded-full animate-eq-bar-1"
                        ></div>
                        <div
                          class="w-0.5 bg-blue-400 rounded-full animate-eq-bar-2"
                        ></div>
                        <div
                          class="w-0.5 bg-blue-400 rounded-full animate-eq-bar-3"
                        ></div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <Icon name="ph:play-fill" class="text-white text-xl" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <NuxtLink
                      :to="`/beat/${beat.id}`"
                      @click.stop
                      class="w-fit max-w-full block"
                    >
                      <h3
                        :class="
                          playingBeatId === beat.id
                            ? 'text-blue-400'
                            : 'text-white hover:text-blue-400'
                        "
                        class="text-sm md:text-base font-bold transition-colors duration-150 truncate"
                      >
                        {{ beat.title }}
                      </h3>
                    </NuxtLink>
                    <NuxtLink
                      :to="`/producer/${beat.producerId}`"
                      @click.stop
                      class="text-xs md:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150 truncate w-fit max-w-full block"
                    >
                      {{ beat.producer }}
                    </NuxtLink>
                    <!-- Mobile meta info -->
                    <div
                      class="md:hidden flex items-center gap-3 mt-1 text-xs text-gray-400"
                    >
                      <span>{{ beat.duration }}</span>
                      <span>•</span>
                      <span>{{ beat.bpm }} BPM</span>
                    </div>
                  </div>
                </div>

                <!-- Time Column -->
                <div class="hidden md:block text-gray-300 text-sm">
                  {{ beat.duration }}
                </div>

                <!-- BPM Column -->
                <div class="hidden md:block text-gray-300 text-sm">
                  {{ beat.bpm }}
                </div>

                <!-- Tags Column -->
                <div class="hidden md:flex flex-wrap gap-2">
                  <span
                    v-for="tag in beat.tags.slice(0, 2)"
                    :key="tag"
                    class="px-2.5 py-1 text-xs font-medium bg-gray-800/50 text-gray-300 rounded-md"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Action Column -->
                <div
                  class="flex items-center gap-2 md:gap-3 col-span-full md:col-span-1 mt-2 md:mt-0"
                >
                  <!-- Mobile tags -->
                  <div class="md:hidden flex flex-wrap gap-1.5 flex-1">
                    <span
                      v-for="tag in beat.tags.slice(0, 2)"
                      :key="tag"
                      class="px-2 py-0.5 text-xs font-medium bg-gray-800/50 text-gray-300 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <button
                    @click.stop
                    class="hidden md:block text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon name="ph:share-network" size="20" />
                  </button>
                  <button
                    @click.stop="openLicenseModal(beat)"
                    class="bg-gray-800 hover:bg-gray-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition flex items-center gap-1.5 md:gap-2 font-semibold whitespace-nowrap text-sm"
                  >
                    <Icon name="ph:shopping-cart" size="16" class="md:hidden" />
                    <Icon
                      name="ph:shopping-cart"
                      size="18"
                      class="hidden md:block"
                    />
                    ${{ beat.price }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </Pagination>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-400 text-lg">No beats available at the moment.</p>
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
import { genres, bpmRanges, musicalKeys } from "~/data/filterData";

definePageMeta({
  middleware: "require-verification",
});

// Fetch beats from API
const { data: beats, pending, error } = await useFetch("/api/beats");

// Beat player state
const { playingBeatId, togglePlay } = useBeatPlayer();

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

// Filter state
const openFilter = ref(null);

// Selected filters state
const selectedFilters = ref({
  genre: [],
  bpm: [],
  key: [],
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

// Close filters when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      openFilter.value = null;
    }
  });
});
</script>

<style scoped>
/* Animated Equalizer Bars */
@keyframes eq-bar-1 {
  0%,
  100% {
    height: 4px;
  }
  50% {
    height: 12px;
  }
}

@keyframes eq-bar-2 {
  0%,
  100% {
    height: 8px;
  }
  50% {
    height: 16px;
  }
}

@keyframes eq-bar-3 {
  0%,
  100% {
    height: 6px;
  }
  50% {
    height: 14px;
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

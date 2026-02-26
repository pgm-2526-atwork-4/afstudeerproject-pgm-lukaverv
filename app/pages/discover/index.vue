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
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            <!-- Genre Filter -->
            <div class="relative">
              <button
                @click="toggleFilter('genre')"
                class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
              >
                <span class="font-medium">
                  Genre
                  <span
                    v-if="selectedFilters.genre.length > 0"
                    class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    {{ selectedFilters.genre.length }}
                  </span>
                </span>
                <Icon
                  name="ph:caret-down"
                  :class="openFilter === 'genre' ? 'rotate-180' : ''"
                  class="transition-transform duration-300 text-gray-400 group-hover:text-blue-400"
                />
              </button>

              <!-- Genre Dropdown -->
              <Transition name="slide-fade">
                <div
                  v-if="openFilter === 'genre'"
                  class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  <div class="max-h-64 overflow-y-auto">
                    <button
                      v-for="genre in genres"
                      :key="genre"
                      @click.stop="toggleSelection('genre', genre)"
                      :class="
                        selectedFilters.genre.includes(genre)
                          ? 'bg-blue-600'
                          : 'hover:bg-blue-600/50'
                      "
                      class="w-full px-6 py-3 text-left text-white transition-colors duration-150 flex items-center gap-3"
                    >
                      <Icon
                        :name="
                          selectedFilters.genre.includes(genre)
                            ? 'ph:check-circle-fill'
                            : 'ph:music-notes-simple'
                        "
                        class="text-blue-400"
                      />
                      <span>{{ genre }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- BPM Filter -->
            <div class="relative">
              <button
                @click="toggleFilter('bpm')"
                class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
              >
                <span class="font-medium">
                  BPM
                  <span
                    v-if="selectedFilters.bpm.length > 0"
                    class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    {{ selectedFilters.bpm.length }}
                  </span>
                </span>
                <Icon
                  name="ph:caret-down"
                  :class="openFilter === 'bpm' ? 'rotate-180' : ''"
                  class="transition-transform duration-300 text-gray-400 group-hover:text-blue-400"
                />
              </button>

              <!-- BPM Dropdown -->
              <Transition name="slide-fade">
                <div
                  v-if="openFilter === 'bpm'"
                  class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  <div class="max-h-64 overflow-y-auto">
                    <button
                      v-for="bpm in bpmRanges"
                      :key="bpm.label"
                      @click.stop="toggleSelection('bpm', bpm.label)"
                      :class="
                        selectedFilters.bpm.includes(bpm.label)
                          ? 'bg-blue-600'
                          : 'hover:bg-blue-600/50'
                      "
                      class="w-full px-6 py-3 text-left text-white transition-colors duration-150 flex items-center gap-3"
                    >
                      <Icon
                        :name="
                          selectedFilters.bpm.includes(bpm.label)
                            ? 'ph:check-circle-fill'
                            : 'ph:metronome'
                        "
                        class="text-blue-400"
                      />
                      <span>{{ bpm.label }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Key Filter -->
            <div class="relative">
              <button
                @click="toggleFilter('key')"
                class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
              >
                <span class="font-medium">
                  Key
                  <span
                    v-if="selectedFilters.key.length > 0"
                    class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    {{ selectedFilters.key.length }}
                  </span>
                </span>
                <Icon
                  name="ph:caret-down"
                  :class="openFilter === 'key' ? 'rotate-180' : ''"
                  class="transition-transform duration-300 text-gray-400 group-hover:text-blue-400"
                />
              </button>

              <!-- Key Dropdown -->
              <Transition name="slide-fade">
                <div
                  v-if="openFilter === 'key'"
                  class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  <div class="max-h-64 overflow-y-auto grid grid-cols-2">
                    <button
                      v-for="key in musicalKeys"
                      :key="key"
                      @click.stop="toggleSelection('key', key)"
                      :class="
                        selectedFilters.key.includes(key)
                          ? 'bg-blue-600'
                          : 'hover:bg-blue-600/50'
                      "
                      class="px-6 py-3 text-left text-white transition-colors duration-150 flex items-center gap-3"
                    >
                      <Icon
                        :name="
                          selectedFilters.key.includes(key)
                            ? 'ph:check-circle-fill'
                            : 'ph:musical-note'
                        "
                        class="text-blue-400"
                      />
                      <span>{{ key }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Mood Filter -->
            <div class="relative">
              <button
                @click="toggleFilter('mood')"
                class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
              >
                <span class="font-medium">
                  Mood
                  <span
                    v-if="selectedFilters.mood.length > 0"
                    class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    {{ selectedFilters.mood.length }}
                  </span>
                </span>
                <Icon
                  name="ph:caret-down"
                  :class="openFilter === 'mood' ? 'rotate-180' : ''"
                  class="transition-transform duration-300 text-gray-400 group-hover:text-blue-400"
                />
              </button>

              <!-- Mood Dropdown -->
              <Transition name="slide-fade">
                <div
                  v-if="openFilter === 'mood'"
                  class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  <div class="max-h-64 overflow-y-auto">
                    <button
                      v-for="mood in moods"
                      :key="mood.name"
                      @click.stop="toggleSelection('mood', mood.name)"
                      :class="
                        selectedFilters.mood.includes(mood.name)
                          ? 'bg-blue-600'
                          : 'hover:bg-blue-600/50'
                      "
                      class="w-full px-6 py-3 text-left text-white transition-colors duration-150 flex items-center gap-3"
                    >
                      <Icon
                        :name="
                          selectedFilters.mood.includes(mood.name)
                            ? 'ph:check-circle-fill'
                            : mood.icon
                        "
                        class="text-blue-400"
                      />
                      <span>{{ mood.name }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Search Bar (appears on scroll) -->
    <Transition name="slide-down">
      <div
        v-if="showStickyHeader"
        class="fixed top-16 left-0 right-0 bg-[#0f1219]/95 backdrop-blur-lg border-b border-gray-700/50 z-40 shadow-2xl"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div class="flex items-center gap-2 md:gap-4">
            <h2
              class="hidden md:block text-xl font-bold text-white whitespace-nowrap"
            >
              DISCOVER BEATS
            </h2>
            <div class="flex-1 relative">
              <Icon
                name="ph:magnifying-glass"
                class="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base"
              />
              <input
                type="text"
                placeholder="Search beats..."
                class="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 rounded-lg text-sm bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold whitespace-nowrap text-sm md:text-base"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Results Section -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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

      <!-- Beats List -->
      <div class="space-y-0">
        <div
          v-for="beat in beats"
          :key="beat.id"
          @click="togglePlay(beat.id)"
          :class="
            playingBeatId === beat.id ? 'bg-blue-600/5' : 'hover:bg-[#1a1f35]'
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
              <NuxtLink :to="`/beat/${beat.id}`" @click.stop>
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
                :to="`/producer/${beat.id}`"
                @click.stop
                class="text-xs md:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150 truncate block"
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
              @click.stop
              class="bg-gray-800 hover:bg-gray-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition flex items-center gap-1.5 md:gap-2 font-semibold whitespace-nowrap text-sm"
            >
              <Icon name="ph:shopping-cart" size="16" class="md:hidden" />
              <Icon name="ph:shopping-cart" size="18" class="hidden md:block" />
              ${{ beat.price }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 md:mt-10 px-3 md:px-4">
        <div
          class="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-3 md:gap-4"
        >
          <!-- Showing results -->
          <p class="text-xs md:text-sm text-gray-400 text-center">
            Showing <span class="text-white font-medium">1–12</span> of
            <span class="text-white font-medium">248</span> beats
          </p>

          <!-- Page buttons -->
          <nav class="flex items-center justify-center gap-1">
            <!-- Prev -->
            <button
              class="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors"
            >
              <Icon name="ph:caret-left" size="16" />
              <span>Prev</span>
            </button>

            <button
              class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium bg-blue-600 text-white"
            >
              1
            </button>
            <button
              class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors"
            >
              2
            </button>
            <button
              class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
            >
              3
            </button>
            <span
              class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 items-center justify-center text-gray-600 text-xs md:text-sm"
              >…</span
            >
            <button
              class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
            >
              21
            </button>

            <!-- Next -->
            <button
              class="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors"
            >
              <span>Next</span>
              <Icon name="ph:caret-right" size="16" />
            </button>
          </nav>

          <!-- Per page -->
          <div class="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <span>Show</span>
            <select
              class="bg-[#1a1f35] border border-gray-700/50 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top -->
    <Transition name="fade-up">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-colors"
      >
        <Icon name="ph:arrow-up-bold" size="18" />
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { sampleBeats } from "~/data/sampleBeats";
import { genres, bpmRanges, musicalKeys, moods } from "~/data/filterData";

definePageMeta({
  middleware: "require-verification",
});

const beats = sampleBeats;

// Filter state
const openFilter = ref(null);
const showStickyHeader = ref(false);
const showBackToTop = ref(false);

// Playing state
const playingBeatId = ref(null);

// Selected filters state
const selectedFilters = ref({
  genre: [],
  bpm: [],
  key: [],
  mood: [],
});

// Toggle play/pause
const togglePlay = (beatId) => {
  if (playingBeatId.value === beatId) {
    playingBeatId.value = null; // Pause
  } else {
    playingBeatId.value = beatId; // Play
  }
};

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

// Handle scroll for sticky header + back to top
const handleScroll = () => {
  showStickyHeader.value = window.scrollY > 400;
  showBackToTop.value = window.scrollY > 600;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Close filters when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      openFilter.value = null;
    }
  });

  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Fade up transition for back to top button */
.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Slide fade transition */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

/* Slide down transition for sticky header */
.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

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

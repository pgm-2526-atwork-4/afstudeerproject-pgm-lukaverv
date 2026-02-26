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
          <div class="relative">
            <Icon
              name="ph:magnifying-glass"
              class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            />
            <input
              type="text"
              placeholder="What type of track are you looking for?"
              class="w-full pl-14 pr-32 py-5 rounded-xl text-lg bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-lg"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg"
            >
              SEARCH
            </button>
          </div>
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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold text-white whitespace-nowrap">
              DISCOVER BEATS
            </h2>
            <div class="flex-1 relative">
              <Icon
                name="ph:magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="What type of track are you looking for?"
                class="w-full pl-12 pr-4 py-3 rounded-lg text-sm bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold whitespace-nowrap"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Results Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Results for "All Tracks"</h2>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg transition bg-blue-600 text-white"
          >
            Table
          </button>
          <button
            class="px-4 py-2 rounded-lg transition bg-[#161b33] border border-gray-700/50 text-gray-400"
          >
            Grid
          </button>
        </div>
      </div>

      <!-- Table View -->
      <div
        class="bg-[#161b33] border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-700/50">
          <thead class="bg-[#0d1230]">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Producer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Track Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                BPM
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Key
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Genre
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700/50">
            <tr
              v-for="beat in beats"
              :key="beat.id"
              @click="togglePlay(beat.id)"
              :class="
                playingBeatId === beat.id
                  ? 'bg-blue-600/10 border-l-4 border-l-blue-500'
                  : 'hover:bg-[#1a2040]'
              "
              class="transition cursor-pointer group"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 relative">
                    <!-- Cover Image -->
                    <img
                      class="h-10 w-10 rounded-full ring-2 ring-gray-700/50 transition-all group-hover:ring-blue-500/50"
                      :src="beat.producerImage"
                      :alt="beat.producer"
                    />
                    <!-- Play/Pause Overlay on Hover or Playing -->
                    <div
                      v-if="playingBeatId === beat.id"
                      class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full"
                    >
                      <!-- Animated Equalizer Bars When Playing -->
                      <div class="flex items-center gap-0.5 h-4">
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
                      class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="ph:play-fill" class="text-white text-lg" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <NuxtLink
                      :to="`/producer/${beat.id}`"
                      @click.stop
                      class="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-150 underline-offset-2 hover:underline decoration-blue-400"
                    >
                      {{ beat.producer }}
                    </NuxtLink>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <!-- Title with visual indicator when playing -->
                  <div>
                    <NuxtLink :to="`/beat/${beat.id}`" @click.stop>
                      <div
                        :class="
                          playingBeatId === beat.id
                            ? 'text-blue-400 font-semibold'
                            : 'text-white hover:text-blue-400'
                        "
                        class="text-sm font-medium transition-colors duration-150 underline-offset-2 hover:underline decoration-blue-400"
                      >
                        {{ beat.title }}
                      </div>
                    </NuxtLink>
                    <div class="text-xs text-gray-400">{{ beat.duration }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ beat.bpm }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ beat.key }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ beat.genre }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in beat.tags"
                    :key="tag"
                    class="px-2 py-1 text-xs font-medium bg-[#0d1230] text-gray-300 rounded border border-gray-700/50"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click.stop
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Icon name="ph:shopping-cart" size="16" />
                  ${{ beat.price }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <nav class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg transition bg-blue-600 text-white"
          >
            1
          </button>
          <button
            class="px-4 py-2 rounded-lg transition bg-[#161b33] border border-gray-700/50 text-gray-400 hover:bg-[#1a2040]"
          >
            2
          </button>
        </nav>
      </div>
    </div>
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

// Handle scroll for sticky header
const handleScroll = () => {
  showStickyHeader.value = window.scrollY > 400;
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

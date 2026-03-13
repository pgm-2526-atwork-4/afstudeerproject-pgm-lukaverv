<template>
  <div>
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

    <!-- Loading State - Skeleton Beats -->
    <SkeletonBeats v-if="pending" :count="12" />

    <!-- Beats List with Pagination -->
    <Pagination
      v-else-if="beats && beats.length > 0"
      :page="currentPage"
      @update:page="$emit('update:currentPage', $event)"
      :items="beats"
      :items-per-page="perPage"
      :per-page-options="[12, 24, 48]"
      item-label="beats"
      @update:items-per-page="
        perPage = $event;
        $emit('update:currentPage', 1);
      "
    >
      <template #default="{ items }">
        <div class="space-y-0">
          <div
            v-for="beat in items"
            :key="beat.id"
            @click="navigateToBeat(beat.id)"
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
                <!-- Waveform animation when this beat is playing -->
                <div
                  v-if="playingBeatId === String(beat.id) && isPlaying"
                  @click.stop.prevent="togglePlay(beat)"
                  class="absolute inset-0 flex items-center justify-center bg-black/50 rounded backdrop-blur-sm cursor-pointer"
                >
                  <div class="flex items-end gap-0.5 h-5">
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
                <!-- Play button on hover -->
                <button
                  v-else
                  @click.stop.prevent="togglePlay(beat)"
                  class="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                >
                  <Icon name="ph:play-fill" class="text-white text-xl" />
                </button>
              </div>
              <div class="min-w-0 flex-1">
                <h3
                  :class="
                    playingBeatId === String(beat.id)
                      ? 'text-blue-400'
                      : 'text-white group-hover:text-blue-400'
                  "
                  class="text-sm md:text-base font-bold transition-colors duration-150 truncate"
                >
                  {{ beat.title }}
                </h3>
                <NuxtLink
                  v-if="showProducer"
                  :to="`/profile/${beat.producerUserId}`"
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
              <template v-if="beat.tags && beat.tags.length">
                <span
                  v-for="tag in beat.tags"
                  :key="tag"
                  class="px-2.5 py-1 text-xs font-medium bg-gray-800/50 text-gray-300 rounded-md"
                >
                  {{ tag }}
                </span>
              </template>
              <span v-else class="text-xs text-gray-500 italic"
                >No tags added.</span
              >
            </div>

            <!-- Action Column -->
            <div
              class="flex items-center gap-2 md:gap-3 col-span-full md:col-span-1 mt-2 md:mt-0"
            >
              <!-- Mobile tags -->
              <div class="md:hidden flex flex-wrap gap-1.5 flex-1">
                <template v-if="beat.tags && beat.tags.length">
                  <span
                    v-for="tag in beat.tags"
                    :key="tag"
                    class="px-2 py-0.5 text-xs font-medium bg-gray-800/50 text-gray-300 rounded"
                  >
                    {{ tag }}
                  </span>
                </template>
                <span v-else class="text-xs text-gray-500 italic"
                  >No tags added.</span
                >
              </div>
              <button
                @click.stop.prevent
                class="hidden md:block text-gray-400 hover:text-white transition-colors"
              >
                <Icon name="ph:share-network" size="20" />
              </button>
              <button
                @click.stop.prevent="openLicenseModal(beat)"
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

    <!-- Empty State - No Results -->
    <div
      v-if="!pending && hasBeats && beats.length === 0"
      class="text-center py-12"
    >
      <Icon
        name="ph:magnifying-glass"
        class="text-gray-600 text-6xl mx-auto mb-4"
      />
      <p class="text-gray-400 text-lg mb-2">
        No beats found matching "{{ searchQuery }}"
      </p>
      <p class="text-gray-500 text-sm mb-4">Try adjusting your search terms</p>
      <button
        @click="$emit('clear-search')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold"
      >
        Clear Search
      </button>
    </div>

    <!-- Empty State - No Beats at all -->
    <div v-if="!pending && !hasBeats" class="text-center py-12">
      <Icon
        name="ph:music-notes-simple"
        class="text-gray-600 text-6xl mx-auto mb-4"
      />
      <p class="text-gray-400 text-lg">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  beats: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  searchQuery: {
    type: String,
    default: "",
  },
  showProducer: {
    type: Boolean,
    default: true,
  },
  pending: {
    type: Boolean,
    default: false,
  },
  hasBeats: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: "No beats available.",
  },
});

const emit = defineEmits([
  "update:currentPage",
  "clear-search",
  "open-license-modal",
]);

const perPage = ref(12);

defineOptions({
  inheritAttrs: false,
});

// Beat player state
const { playingBeatId, isPlaying, togglePlay } = useBeatPlayer();

// Navigation
const { navigateToBeat } = useNavigation();

// License modal handler
const openLicenseModal = (beat) => {
  emit("open-license-modal", beat);
};
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

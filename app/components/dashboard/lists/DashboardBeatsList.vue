<template>
  <div class="bg-dark-800 rounded-xl shadow-2xl">
    <!-- Header -->
    <div class="p-4 sm:p-6 md:p-8 border-b border-dark-700/50">
      <DashboardFilterBar
        title="My Beats"
        :subtitle="`${total ?? beats?.length ?? 0} total beats`"
        :sort="sort"
        @update:sort="$emit('update:sort', $event)"
        v-model:search="searchQuery"
        :sort-options="[
          { value: 'newest', label: 'Most Recent' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'popular', label: 'Most Popular' },
          { value: 'unpopular', label: 'Least Popular' },
        ]"
        search-placeholder="Search beats..."
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
      ></div>
      <p class="text-gray-400 mt-4">Loading beats...</p>
    </div>

    <!-- Beats List -->
    <div
      v-else-if="beats && beats.length > 0"
      class="divide-y divide-gray-700/30"
    >
      <NuxtLink
        v-for="beat in filteredBeats"
        :key="beat._id"
        :to="`/dashboard/beat/${beat._id}`"
        class="p-3 sm:p-4 hover:bg-dark-750 transition-colors group block"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Artwork -->
          <div class="flex-shrink-0">
            <img
              :src="beat.artworkUrl"
              :alt="beat.title"
              class="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover bg-dark-700"
            />
          </div>

          <!-- Beat Info -->
          <div class="flex-1 min-w-0">
            <h3
              class="text-sm sm:text-base text-white font-medium truncate group-hover:text-primary-400 transition-colors"
            >
              {{ beat.title }}
            </h3>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
              <span class="text-xs sm:text-sm text-gray-400"
                >{{ beat.bpm }} BPM</span
              >
              <span class="text-xs sm:text-sm text-gray-400">{{
                beat.key
              }}</span>
              <span class="text-xs sm:text-sm text-gray-400 hidden sm:inline">{{
                beat.genre
              }}</span>
            </div>
            <div class="flex items-center gap-3 mt-1.5">
              <span class="flex items-center gap-1 text-xs text-gray-500">
                <Icon name="ph:play-fill" size="11" class="text-primary-400" />
                {{ beat.playsCount ?? 0 }}
              </span>
              <span class="flex items-center gap-1 text-xs text-gray-500">
                <Icon name="ph:heart-fill" size="11" class="text-red-400" />
                {{ beat.likesCount ?? 0 }}
              </span>
              <span class="flex items-center gap-1 text-xs text-gray-500">
                <Icon
                  name="ph:chat-circle-fill"
                  size="11"
                  class="text-blue-400"
                />
                {{ beat.commentsCount ?? 0 }}
              </span>
              <span class="text-xs text-gray-500">{{
                formatDate(beat.createdAt)
              }}</span>
            </div>
          </div>

          <!-- Arrow Icon -->
          <div class="flex-shrink-0">
            <Icon
              name="ph:caret-right"
              class="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors"
            />
          </div>
        </div>
      </NuxtLink>

      <!-- Empty Search State -->
      <div
        v-if="filteredBeats.length === 0 && searchQuery"
        class="p-12 text-center"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="text-gray-400 mb-2">No beats found</p>
        <p class="text-sm text-gray-500">Try a different search term</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg
        class="w-16 h-16 mx-auto text-gray-600 mb-4"
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
      <p class="text-gray-400 mb-2">No beats yet</p>
      <p class="text-sm text-gray-500 mb-4">
        Upload your first beat to get started
      </p>
      <NuxtLink
        to="/beat/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Create Your First Beat
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Beat {
  _id: string;
  title: string;
  artworkUrl: string;
  bpm: number;
  key: string;
  genre: string;
  createdAt: string;
  playsCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

interface Props {
  beats?: Beat[];
  loading?: boolean;
  total?: number;
  sort?: string;
}

const props = withDefaults(defineProps<Props>(), { sort: "newest" });
const emit = defineEmits<{ "update:sort": [value: string] }>();

const searchQuery = ref("");

const filteredBeats = computed(() => {
  if (!props.beats) return [];
  if (!searchQuery.value) return props.beats;

  const query = searchQuery.value.toLowerCase();
  return props.beats.filter(
    (beat) =>
      beat.title.toLowerCase().includes(query) ||
      beat.genre.toLowerCase().includes(query) ||
      beat.key.toLowerCase().includes(query),
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
</script>

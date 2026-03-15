<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
            >
              STUDIO DASHBOARD
            </h1>
            <p class="text-lg md:text-xl text-gray-300">
              Manage your beats and track your analytics
            </p>
          </div>
          <NuxtLink
            to="/beat/create"
            class="hidden md:flex px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium items-center gap-2"
          >
            <Icon name="ph:plus" class="w-5 h-5" />
            Create Beat
          </NuxtLink>
        </div>

        <!-- Mobile Create Button -->
        <NuxtLink
          to="/beat/create"
          class="md:hidden mt-6 flex w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium items-center justify-center gap-2"
        >
          <Icon name="ph:plus" class="w-5 h-5" />
          Create Beat
        </NuxtLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-700/30 sticky top-16 bg-dark-900 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 md:px-6 py-4 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap relative outline-none select-none',
              activeTab === tab.id
                ? 'bg-primary-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
            ]"
            :style="activeTab === tab.id ? { color: 'rgb(59, 130, 246)' } : {}"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-slideIn"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'">
        <div class="space-y-8">
          <!-- Weekly Chart -->
          <Suspense>
            <template #default>
              <AnalyticsChart />
            </template>
            <template #fallback>
              <AnalyticsChartLoader />
            </template>
          </Suspense>

          <!-- Stats Grid -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-white">Top Performers</h2>
              <PeriodFilter v-model="analyticsPeriod" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Top Tracks -->
              <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-white">Top Tracks</h2>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ analyticsPeriodLabel }}
                  </p>
                </div>

                <div class="space-y-3">
                  <div
                    v-if="topTracks.length === 0"
                    class="text-center py-8 text-gray-400"
                  >
                    <p>No plays yet. Share your beats to get started!</p>
                  </div>
                  <NuxtLink
                    v-for="(track, index) in topTracks"
                    :key="index"
                    :to="`/dashboard/beat/${track.id}`"
                    class="group flex items-center gap-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl p-4 transition-all duration-300"
                  >
                    <span
                      class="flex-shrink-0 w-5 text-right text-sm font-semibold text-gray-500"
                      >{{ index + 1 }}</span
                    >
                    <img
                      :src="track.image"
                      :alt="track.title"
                      class="w-14 h-14 rounded-lg object-cover bg-dark-600 group-hover:scale-105 transition-transform flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-white font-semibold truncate group-hover:text-primary-400 transition-colors"
                      >
                        {{ track.title }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">
                        {{ track.bpm }} BPM
                      </p>
                      <div class="flex items-center gap-3 mt-1.5">
                        <span
                          class="flex items-center gap-1 text-xs text-gray-400"
                        >
                          <Icon
                            name="ph:play-fill"
                            size="12"
                            class="text-primary-400"
                          />
                          {{ track.plays }}
                        </span>
                        <span
                          class="flex items-center gap-1 text-xs text-gray-400"
                        >
                          <Icon
                            name="ph:heart-fill"
                            size="12"
                            class="text-red-400"
                          />
                          {{ track.likes }}
                        </span>
                        <span
                          class="flex items-center gap-1 text-xs text-gray-400"
                        >
                          <Icon
                            name="ph:chat-circle-fill"
                            size="12"
                            class="text-blue-400"
                          />
                          {{ track.comments }}
                        </span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- Top Fans -->
              <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-white">Top Fans</h2>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ analyticsPeriodLabel }}
                  </p>
                </div>

                <div class="space-y-3">
                  <div
                    v-if="topFans.length === 0"
                    class="text-center py-8 text-gray-400"
                  >
                    <p>No fans yet. Keep promoting your beats!</p>
                  </div>
                  <NuxtLink
                    v-for="(fan, index) in topFans"
                    :key="index"
                    :to="fan.userId ? `/profile/${fan.userId}` : '#'"
                    class="group flex items-center gap-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl p-4 transition-all duration-300"
                  >
                    <span
                      class="flex-shrink-0 w-5 text-right text-sm font-semibold text-gray-500"
                      >{{ index + 1 }}</span
                    >
                    <img
                      v-if="fan.profilePicture"
                      :src="fan.profilePicture"
                      :alt="fan.username"
                      class="w-14 h-14 rounded-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div
                      v-else
                      class="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0"
                    >
                      <Icon
                        name="mdi:account-circle"
                        class="w-12 h-12 text-gray-400"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-white font-semibold truncate group-hover:text-primary-400 transition-colors"
                      >
                        {{ fan.username }}
                      </p>
                      <span
                        class="flex items-center gap-1 text-xs text-gray-400 mt-1"
                      >
                        <Icon
                          name="ph:play-fill"
                          size="12"
                          class="text-primary-400"
                        />
                        {{ fan.plays }} total plays on your tracks
                      </span>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracks Tab -->
      <div v-if="activeTab === 'tracks'">
        <Pagination
          :items="sortedBeats"
          :page="currentPage"
          :items-per-page="beatsPerPage"
          item-label="beats"
          :per-page-options="[12, 24, 48]"
          @update:page="currentPage = $event"
          @update:items-per-page="beatsPerPage = $event"
          v-slot="{ items: paginatedBeats }"
        >
          <DashboardBeatsList
            :beats="paginatedBeats as any"
            :loading="pending"
            :total="userBeats?.length"
            v-model:sort="beatSort"
          />
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is protected by the producer-only middleware
// Only producers can access this page
definePageMeta({
  title: "Dashboard",
  middleware: "producer-only",
});

const activeTab = ref("analytics");

// Pagination state for tracks tab
const currentPage = ref(1);
const beatsPerPage = ref(12);

const tabs = [
  { id: "analytics", label: "Analytics" },
  { id: "tracks", label: "Tracks" },
];

// Tracks tab sort
const beatSort = ref("newest");

// Fetch producer's beats
const { data: userBeats, pending } = await useFetch("/api/beats/user", {
  headers: useRequestHeaders(["cookie"]),
});

// Analytics period filter
const analyticsPeriod = ref("all");

const analyticsPeriodLabel = computed(() => {
  const labels: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };
  return labels[analyticsPeriod.value] || "All Time";
});

// Fetch analytics data dynamically with period filter
const { data: analytics } = await useFetch(
  () => `/api/dashboard/analytics?period=${analyticsPeriod.value}`,
  {
    headers: useRequestHeaders(["cookie"]),
  },
);

// Use dynamic data from API or fall back to empty arrays
const topTracks = computed(() => (analytics.value?.topTracks || []) as any[]);
const topFans = computed(() => (analytics.value?.topFans || []) as any[]);

watch(beatSort, () => {
  currentPage.value = 1;
});

type SortKey = "newest" | "oldest" | "popular" | "unpopular";

const sortFns: Record<SortKey, (a: any, b: any) => number> = {
  newest: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  oldest: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  popular: (a, b) => (b.playsCount ?? 0) - (a.playsCount ?? 0),
  unpopular: (a, b) => (a.playsCount ?? 0) - (b.playsCount ?? 0),
};

const sortedBeats = computed(() => {
  const beats = [...((userBeats.value as any[]) || [])];
  return beats.sort(sortFns[beatSort.value as SortKey] ?? sortFns.newest);
});
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
  transform-origin: left;
}
</style>

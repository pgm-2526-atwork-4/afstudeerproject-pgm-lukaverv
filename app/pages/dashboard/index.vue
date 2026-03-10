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
            Create Beat
          </NuxtLink>
        </div>

        <!-- Mobile Create Button -->
        <NuxtLink
          to="/beat/create"
          class="md:hidden mt-6 flex w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium items-center justify-center gap-2"
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
          <AnalyticsChart />

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Tracks -->
            <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-white">Top Tracks</h2>
                  <p class="text-sm text-gray-400 mt-1">This Week</p>
                </div>
                <div class="bg-primary-500/10 px-4 py-2 rounded-lg">
                  <p class="text-primary-400 font-bold text-sm">Top 4</p>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(track, index) in topTracks"
                  :key="index"
                  class="group bg-dark-700/50 hover:bg-dark-700 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 relative">
                      <div
                        class="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                        :class="
                          index === 0
                            ? 'bg-yellow-500 text-dark-900'
                            : 'bg-dark-600 text-gray-400'
                        "
                      >
                        {{ index + 1 }}
                      </div>
                      <img
                        :src="track.image"
                        :alt="track.title"
                        class="w-16 h-16 rounded-lg object-cover bg-dark-600 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-white font-semibold truncate group-hover:text-primary-400 transition-colors"
                      >
                        {{ track.title }}
                      </p>
                      <div class="flex items-center gap-3 mt-1">
                        <span class="text-sm text-gray-400"
                          >{{ track.bpm }} BPM</span
                        >
                        <span class="text-xs text-gray-500">•</span>
                        <span class="text-sm font-medium text-primary-500"
                          >{{ track.plays }} plays</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Fans -->
            <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-white">Top Fans</h2>
                  <p class="text-sm text-gray-400 mt-1">This Week</p>
                </div>
                <div class="bg-primary-500/10 px-4 py-2 rounded-lg">
                  <p class="text-primary-400 font-bold text-sm">Top 4</p>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(fan, index) in topFans"
                  :key="index"
                  class="group bg-dark-700/50 hover:bg-dark-700 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 relative">
                      <div
                        class="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs z-10"
                        :class="
                          index === 0
                            ? 'bg-yellow-500 text-dark-900'
                            : 'bg-dark-600 text-gray-400'
                        "
                      >
                        {{ index + 1 }}
                      </div>
                      <div
                        class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                      >
                        <span class="text-white font-bold text-xl">{{
                          fan.username.charAt(0).toUpperCase()
                        }}</span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-white font-semibold truncate group-hover:text-primary-400 transition-colors"
                      >
                        {{ fan.username }}
                      </p>
                      <p class="text-sm font-medium text-primary-500 mt-1">
                        {{ fan.plays }} plays
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracks Tab -->
      <div v-if="activeTab === 'tracks'">
        <Pagination
          :items="userBeats || []"
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
          />
        </Pagination>
      </div>

      <!-- Insights Tab -->
      <div v-if="activeTab === 'insights'">
        <div class="bg-dark-800 rounded-xl p-12 shadow-2xl text-center">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="text-xl font-bold text-white mb-2">Coming Soon</h3>
          <p class="text-gray-400">
            Advanced insights and analytics will be available here
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is protected by the producer-only middleware
// Only producers can access this page
definePageMeta({
  middleware: "producer-only",
});

const { data: session } = useAuth();
const activeTab = ref("analytics");

// Pagination state for tracks tab
const currentPage = ref(1);
const beatsPerPage = ref(12);

const tabs = [
  { id: "analytics", label: "Analytics" },
  { id: "tracks", label: "Tracks" },
  { id: "insights", label: "Insights" },
];

// Fetch producer's beats dynamically
const { data: userBeats, pending } = await useFetch("/api/beats/user", {
  headers: useRequestHeaders(["cookie"]),
});

// Hardcoded data for top tracks (we'll make this dynamic later)
const topTracks = ref([
  {
    title: 'Old XXXTENTACION Type Beat - "YESTERDAY"',
    plays: 5,
    bpm: 140,
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop&crop=center",
  },
  {
    title: 'Old Hard XXXTENTACION Type Beat - "GODSPOKEN"',
    plays: 4,
    bpm: 137,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop&crop=center",
  },
  {
    title: 'Old Hard XXXTENTACION Type Beat - "PRAYER"',
    plays: 3,
    bpm: 142,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center",
  },
  {
    title: "Old XXXTENTACION Type Beat - Collapse",
    plays: 2,
    bpm: 138,
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop&crop=center",
  },
]);

// Hardcoded data for top fans (we'll make this dynamic later)
const topFans = ref([
  { username: "pwnproof868", plays: 3 },
  { username: "A5", plays: 3 },
  { username: "changebacket", plays: 3 },
  { username: "xander!2005232327", plays: 2 },
]);
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

<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Hero Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <div>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
          >
            MY DOWNLOADS
          </h1>
          <p class="text-lg md:text-xl text-gray-300">
            Your purchased beats and license files
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Search Bar (only shown when there are downloads) -->
      <SearchInput
        v-if="!pending && downloads && downloads.length > 0"
        v-model="searchQuery"
        class="mb-8"
      />

      <!-- Loading -->
      <div v-if="pending" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-[#1a1f35] rounded-xl border border-gray-700/40 p-6 animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-800 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-gray-800 rounded w-1/3"></div>
              <div class="h-4 bg-gray-800 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State - No Downloads -->
      <div
        v-else-if="!downloads || downloads.length === 0"
        class="text-center py-20"
      >
        <Icon
          name="ph:download-simple"
          class="w-20 h-20 mx-auto mb-4 text-gray-600"
        />
        <h2 class="text-xl font-bold text-white mb-2">No downloads yet</h2>
        <p class="text-gray-400 mb-6">
          Purchase beats to see your downloads here
        </p>
        <NuxtLink
          to="/discover"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Icon name="ph:music-notes" size="20" />
          Discover Beats
        </NuxtLink>
      </div>

      <!-- Empty State - No Search Results -->
      <div v-else-if="filteredDownloads.length === 0" class="text-center py-20">
        <Icon
          name="ph:magnifying-glass"
          class="w-20 h-20 mx-auto mb-4 text-gray-600"
        />
        <h2 class="text-xl font-bold text-white mb-2">
          No downloads found matching "{{ searchQuery }}"
        </h2>
        <p class="text-gray-400 mb-6">Try adjusting your search terms</p>
        <button
          @click="searchQuery = ''"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          Clear Search
        </button>
      </div>

      <!-- Downloads List with Pagination -->
      <Pagination
        v-else
        :items="filteredDownloads"
        :items-per-page="10"
        item-label="downloads"
        :per-page-options="[10, 20, 50]"
      >
        <template #default="{ items }">
          <div class="space-y-4 mb-4">
            <div
              v-for="item in items"
              :key="item.id"
              class="bg-[#1a1f35] rounded-xl border border-gray-700/40 p-4 sm:p-6 hover:border-gray-600/60 transition-colors"
            >
              <div class="flex items-start gap-4 sm:gap-6">
                <NuxtLink :to="`/beat/${item.beatId}`" class="flex-shrink-0">
                  <img
                    :src="item.coverImage"
                    :alt="item.title"
                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                </NuxtLink>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <NuxtLink
                        :to="`/beat/${item.beatId}`"
                        class="text-white font-bold text-base sm:text-lg hover:text-blue-400 transition-colors truncate block"
                      >
                        {{ item.title }}
                      </NuxtLink>
                      <p class="text-gray-400 text-sm">{{ item.producer }}</p>
                    </div>
                    <span
                      class="px-2.5 py-0.5 text-xs font-semibold rounded-full flex-shrink-0"
                      :class="{
                        'bg-gray-700/50 text-gray-300':
                          item.licenseType === 'BASIC',
                        'bg-blue-600/20 text-blue-400':
                          item.licenseType === 'PREMIUM',
                        'bg-purple-600/20 text-purple-400':
                          item.licenseType === 'EXCLUSIVE',
                      }"
                    >
                      {{ item.licenseType }}
                    </span>
                  </div>

                  <!-- Beat Metadata -->
                  <div
                    class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3"
                  >
                    <span>Purchased {{ formatDate(item.purchasedAt) }}</span>
                    <span v-if="item.bpm" class="text-gray-600">•</span>
                    <span v-if="item.bpm">{{ item.bpm }} BPM</span>
                    <span v-if="item.key" class="text-gray-600">•</span>
                    <span v-if="item.key">{{ item.key }}</span>
                    <span v-if="item.genre" class="text-gray-600">•</span>
                    <span v-if="item.genre">{{ item.genre }}</span>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="file in item.files"
                      :key="file.type"
                      @click="
                        downloadFile(
                          file.url,
                          `${item.title} - ${item.producer} (${item.licenseType}).${file.type.toLowerCase()}`,
                          file.type,
                          item.id,
                        )
                      "
                      :disabled="downloading[`${item.id}-${file.type}`]"
                      class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 text-blue-400 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Icon
                        :name="
                          downloading[`${item.id}-${file.type}`]
                            ? 'svg-spinners:ring-resize'
                            : 'ph:download-simple'
                        "
                        size="16"
                      />
                      {{
                        downloading[`${item.id}-${file.type}`]
                          ? "Downloading..."
                          : file.type
                      }}
                    </button>

                    <!-- License info -->
                    <button
                      @click="downloadLicenseDoc(item)"
                      class="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Icon name="ph:file-text" size="16" />
                      LICENSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Pagination>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Downloads",
});

usePageTitle(() => "My Downloads");

const { formatDate } = useFormatters();
const { downloading, downloadFile, downloadLicenseDoc } = useDownloads();
const { data: downloads, pending } = await useFetch("/api/downloads");

// Search functionality
const searchQuery = ref("");

const filteredDownloads = computed(() => {
  if (!downloads.value || !searchQuery.value) {
    return downloads.value || [];
  }

  const query = searchQuery.value.toLowerCase();
  return downloads.value.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.producer.toLowerCase().includes(query) ||
      item.licenseType.toLowerCase().includes(query) ||
      (item.genre && item.genre.toLowerCase().includes(query))
    );
  });
});
</script>

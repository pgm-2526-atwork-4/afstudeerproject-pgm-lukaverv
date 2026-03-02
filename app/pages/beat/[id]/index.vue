<template>
  <div class="min-h-screen pt-16 bg-gradient-to-b from-[#0f1219] to-[#0a0d14]">
    <!-- Back Button -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton />
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div class="animate-pulse">
        <div class="grid lg:grid-cols-[320px_1fr] gap-8">
          <!-- Sidebar Skeleton -->
          <div class="space-y-6">
            <div class="aspect-square bg-gray-800 rounded-xl"></div>
            <div class="h-8 bg-gray-800 rounded w-3/4"></div>
            <div class="h-6 bg-gray-800 rounded w-1/2"></div>
          </div>
          <!-- Content Skeleton -->
          <div class="space-y-6">
            <div class="grid md:grid-cols-3 gap-4">
              <div class="h-48 bg-gray-800 rounded-xl"></div>
              <div class="h-48 bg-gray-800 rounded-xl"></div>
              <div class="h-48 bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <Icon
        name="ph:warning-circle"
        class="text-red-400 text-6xl mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-white mb-2">Beat Not Found</h2>
      <p class="text-gray-400 mb-6">
        The beat you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink
        to="/discover"
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
      >
        <Icon name="ph:arrow-left" size="20" />
        Back to Discover
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div
      v-else-if="beat"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div class="grid lg:grid-cols-[320px_1fr] gap-8">
        <!-- Left Sidebar -->
        <div class="space-y-6">
          <!-- Beat Cover Image -->
          <div class="relative group">
            <img
              :src="beat.coverImage"
              :alt="beat.title"
              class="w-full aspect-square rounded-xl object-cover"
            />
            <!-- Play Button Overlay -->
            <div
              @click="togglePlay(beat.id)"
              class="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div
                class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Icon
                  :name="
                    playingBeatId === beat.id ? 'ph:pause-fill' : 'ph:play-fill'
                  "
                  class="text-white text-3xl"
                  :class="playingBeatId !== beat.id ? 'ml-1' : ''"
                />
              </div>
            </div>
          </div>

          <!-- Beat Title & Producer -->
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
              {{ beat.title }}
            </h1>
            <NuxtLink
              :to="`/profile/${beat.producerUserId}`"
              class="text-gray-400 hover:text-blue-400 transition-colors text-lg"
            >
              {{ beat.producer }}
            </NuxtLink>
          </div>

          <!-- Beat Details Table -->
          <div
            class="bg-[#161b33] rounded-xl overflow-hidden border border-gray-700/30"
          >
            <div class="grid grid-cols-2 divide-x divide-y divide-gray-700/30">
              <!-- BPM -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  BPM
                </div>
                <div class="text-xl font-bold text-white">{{ beat.bpm }}</div>
              </div>

              <!-- Key -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Key
                </div>
                <div class="text-xl font-bold text-white">{{ beat.key }}</div>
              </div>

              <!-- Time -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Time
                </div>
                <div class="text-xl font-bold text-white">
                  {{ beat.duration }}
                </div>
              </div>

              <!-- Genre -->
              <div class="p-4">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider mb-1"
                >
                  Genre
                </div>
                <div class="text-xl font-bold text-white">{{ beat.genre }}</div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
            >
              Tags
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in beat.tags"
                :key="tag"
                class="px-3 py-1.5 text-sm font-medium bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/30"
              >
                #{{ tag.toLowerCase() }}
              </span>
            </div>
          </div>

          <!-- Track Description -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
            >
              Track Description
            </h3>
            <p class="text-gray-300 leading-relaxed">
              {{ beat.description }}
            </p>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="space-y-8">
          <!-- License Options -->
          <div>
            <div class="grid md:grid-cols-3 gap-4 mb-8">
              <!-- Basic License -->
              <button
                @click="selectedLicense = 'basic'"
                :class="
                  selectedLicense === 'basic'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'basic'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">Basic License</h3>
                <p class="text-xs text-gray-400 mb-4">(TAGGED MP3)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.priceBasic.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">MP3</p>
              </button>

              <!-- Premium License -->
              <button
                @click="selectedLicense = 'premium'"
                :class="
                  selectedLicense === 'premium'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'premium'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">
                  Premium License
                </h3>
                <p class="text-xs text-gray-400 mb-4">(UNTAGGED WAV + MP3)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.pricePremium.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">WAV, MP3</p>
              </button>

              <!-- Exclusive License -->
              <button
                @click="selectedLicense = 'exclusive'"
                :class="
                  selectedLicense === 'exclusive'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-6 rounded-xl border-2 transition-all text-center"
              >
                <div
                  v-if="selectedLicense === 'exclusive'"
                  class="absolute top-3 right-3"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">
                  Exclusive License
                </h3>
                <p class="text-xs text-gray-400 mb-4">(EXCLUSIVE RIGHTS)</p>
                <div
                  class="bg-gray-800/50 px-6 py-3 rounded-lg inline-block mb-2"
                >
                  <span class="text-2xl font-bold text-white"
                    >${{ beat.priceExclusive.toFixed(2) }}</span
                  >
                </div>
                <p class="text-xs text-gray-400">WAV, MP3</p>
              </button>
            </div>

            <!-- Usage Terms -->
            <div
              class="bg-[#161b33] rounded-xl p-6 border border-gray-700/30 mb-6"
            >
              <h3 class="text-xl font-bold text-white mb-6">Usage Terms</h3>
              <div class="text-lg font-semibold text-blue-400 mb-6">
                {{ selectedLicenseLabel }}
              </div>

              <div class="grid md:grid-cols-3 gap-6">
                <!-- Streaming -->
                <div class="flex items-start gap-3">
                  <Icon
                    name="ph:play-circle"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.streams }}
                    </p>
                    <p class="text-sm text-gray-400">streams</p>
                  </div>
                </div>

                <!-- Monetization -->
                <div class="flex items-start gap-3">
                  <Icon
                    name="ph:currency-dollar-simple"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.monetization }}
                    </p>
                    <p class="text-sm text-gray-400">for streaming platforms</p>
                  </div>
                </div>

                <!-- Exclusivity -->
                <div class="flex items-start gap-3">
                  <Icon
                    :name="
                      usageTerms.exclusive ? 'ph:check-circle' : 'ph:x-circle'
                    "
                    :class="
                      usageTerms.exclusive ? 'text-green-400' : 'text-red-400'
                    "
                    class="flex-shrink-0 mt-1"
                    size="24"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1">
                      {{ usageTerms.exclusiveText }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ usageTerms.exclusiveSubtext }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <Icon name="ph:shopping-cart" size="24" />
              Add to cart
            </button>
          </div>

          <!-- More from Producer Section -->
          <div v-if="producerBeats && producerBeats.length > 0">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">
                More from {{ beat.producer }}
              </h2>
              <NuxtLink
                :to="`/producer/${beat.producerId}/all-tracks`"
                class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                See all
                <Icon name="ph:arrow-right" size="16" />
              </NuxtLink>
            </div>

            <!-- Beats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                v-for="producerBeat in producerBeats"
                :key="producerBeat.id"
                class="group"
              >
                <div class="relative mb-3">
                  <img
                    :src="producerBeat.coverImage"
                    :alt="producerBeat.title"
                    class="w-full aspect-square rounded-lg object-cover"
                  />
                  <div
                    @click.stop="togglePlay(producerBeat.id)"
                    class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div
                      class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Icon
                        :name="
                          playingBeatId === producerBeat.id
                            ? 'ph:pause-fill'
                            : 'ph:play-fill'
                        "
                        class="text-white text-xl"
                        :class="
                          playingBeatId !== producerBeat.id ? 'ml-0.5' : ''
                        "
                      />
                    </div>
                  </div>
                </div>
                <NuxtLink :to="`/beat/${producerBeat.id}`">
                  <h3
                    class="text-white font-bold text-sm mb-1 truncate hover:text-blue-400 transition-colors"
                  >
                    {{ producerBeat.title }}
                  </h3>
                </NuxtLink>
                <p class="text-gray-400 text-sm">${{ producerBeat.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BackToTop />
  </div>
</template>

<script setup>
const route = useRoute();
const beatId = route.params.id;

// Fetch beat details
const { data: beat, pending, error } = await useFetch(`/api/beats/${beatId}`);

// Fetch all beats to filter producer beats
const { data: allBeats } = await useFetch("/api/beats");

// Filter beats from the same producer (top 5)
const producerBeats = computed(() => {
  if (!beat.value || !allBeats.value) return [];
  return allBeats.value
    .filter(
      (b) => b.producerId === beat.value.producerId && b.id !== beat.value.id,
    )
    .slice(0, 5);
});

const { playingBeatId, togglePlay } = useBeatPlayer();
const { getLicenseLabel, getUsageTerms } = useLicenseData();

// License selection
const selectedLicense = ref("basic");
const selectedLicenseLabel = computed(() =>
  getLicenseLabel(selectedLicense.value),
);
const usageTerms = computed(() => getUsageTerms(selectedLicense.value));
</script>

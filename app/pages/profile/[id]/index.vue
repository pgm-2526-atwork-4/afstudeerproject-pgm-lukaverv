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
        <div class="bg-[#1a1f35]/40 rounded-xl p-6 mb-8">
          <div class="flex items-center gap-6 mb-6">
            <div class="h-32 w-32 bg-gray-800 rounded-full"></div>
            <div class="flex-1">
              <div class="h-8 bg-gray-800 rounded w-2/3 mb-4"></div>
              <div class="h-6 bg-gray-800 rounded w-1/3"></div>
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
      <h2 class="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
      <p class="text-gray-400 mb-6">
        Unable to load this profile. It may have been removed or doesn't exist.
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
      v-else-if="userData"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <!-- Profile Header Card -->
      <div
        class="bg-[#1a1f35]/40 rounded-xl p-6 md:p-8 mb-8 border border-gray-700/30 relative"
      >
        <!-- Role Badge - Top Left -->
        <div
          class="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide"
          :class="
            userData.role === 'PRODUCER'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          "
        >
          <Icon
            :name="
              userData.role === 'PRODUCER'
                ? 'ph:music-notes-fill'
                : 'ph:headphones-fill'
            "
            class="w-4 h-4"
          />
          <span>{{ userData.role }}</span>
        </div>

        <!-- Profile Info - Centered Layout -->
        <div class="text-center mb-8">
          <!-- Profile Picture -->
          <div class="flex justify-center mb-4">
            <img
              :src="userData.profilePicture"
              :alt="userData.username"
              class="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-blue-500/20 shadow-xl"
            />
          </div>

          <!-- Username -->
          <h1
            class="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            {{ userData.username }}
          </h1>
        </div>

        <!-- Stats Grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 pt-6 border-t border-gray-700/30"
        >
          <!-- Followers -->
          <div class="text-center p-4 bg-[#0f1219]/50 rounded-lg">
            <Icon name="ph:users" class="text-gray-400 text-2xl mx-auto mb-2" />
            <div class="text-xl md:text-2xl font-bold text-white mb-1">
              {{ userData.stats?.followers || 0 }}
            </div>
            <div class="text-xs md:text-sm text-gray-400 font-medium">
              Followers
            </div>
          </div>

          <!-- Following -->
          <div class="text-center p-4 bg-[#0f1219]/50 rounded-lg">
            <Icon
              name="ph:user-plus"
              class="text-gray-400 text-2xl mx-auto mb-2"
            />
            <div class="text-xl md:text-2xl font-bold text-white mb-1">
              {{ userData.stats?.following || 0 }}
            </div>
            <div class="text-xs md:text-sm text-gray-400 font-medium">
              Following
            </div>
          </div>

          <!-- Plays -->
          <div class="text-center p-4 bg-[#0f1219]/50 rounded-lg">
            <Icon
              name="ph:play-circle"
              class="text-gray-400 text-2xl mx-auto mb-2"
            />
            <div class="text-xl md:text-2xl font-bold text-white mb-1">
              {{ userData.stats?.plays || 0 }}
            </div>
            <div class="text-xs md:text-sm text-gray-400 font-medium">
              Plays
            </div>
          </div>

          <!-- Tracks -->
          <div class="text-center p-4 bg-[#0f1219]/50 rounded-lg">
            <Icon
              name="ph:music-notes-simple"
              class="text-gray-400 text-2xl mx-auto mb-2"
            />
            <div class="text-xl md:text-2xl font-bold text-white mb-1">
              {{ userData.stats?.tracks || 0 }}
            </div>
            <div class="text-xs md:text-sm text-gray-400 font-medium">
              Tracks
            </div>
          </div>

          <!-- Member Since -->
          <div
            class="col-span-2 md:col-span-1 text-center p-4 bg-[#0f1219]/50 rounded-lg"
          >
            <Icon
              name="ph:calendar-check"
              class="text-gray-400 text-2xl mx-auto mb-2"
            />
            <div class="text-sm md:text-base font-bold text-white mb-1">
              {{ formatMemberSince(userData.createdAt) }}
            </div>
            <div class="text-xs md:text-sm text-gray-400 font-medium">
              Member Since
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid lg:grid-cols-[280px_1fr] gap-8">
        <!-- Left Sidebar -->
        <div class="space-y-6">
          <!-- About Me -->
          <div class="bg-[#1a1f35]/40 rounded-xl p-6 border border-gray-700/30">
            <h3 class="text-lg font-bold text-white mb-4">About me</h3>
            <p class="text-sm text-gray-300 leading-relaxed">
              {{
                userData.bio ||
                (isOwnProfile
                  ? "You haven't provided a bio yet."
                  : "This user hasn't provided a bio yet.")
              }}
            </p>
          </div>

          <!-- Find me on -->
          <div class="bg-[#1a1f35]/40 rounded-xl p-6 border border-gray-700/30">
            <h3 class="text-lg font-bold text-white mb-4">Find me on</h3>
            <div v-if="hasSocialLinks" class="space-y-3">
              <!-- Instagram -->
              <a
                v-if="socialLinks.instagram"
                :href="socialLinks.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group"
              >
                <Icon
                  name="ph:instagram-logo"
                  class="text-xl group-hover:scale-110 transition-transform"
                />
                <span class="text-sm font-medium">Instagram</span>
              </a>

              <!-- SoundCloud -->
              <a
                v-if="socialLinks.soundcloud"
                :href="socialLinks.soundcloud"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group"
              >
                <Icon
                  name="ph:soundcloud-logo"
                  class="text-xl group-hover:scale-110 transition-transform"
                />
                <span class="text-sm font-medium">SoundCloud</span>
              </a>

              <!-- YouTube -->
              <a
                v-if="socialLinks.youtube"
                :href="socialLinks.youtube"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group"
              >
                <Icon
                  name="ph:youtube-logo"
                  class="text-xl group-hover:scale-110 transition-transform"
                />
                <span class="text-sm font-medium">Youtube</span>
              </a>
            </div>
            <p v-else class="text-sm text-gray-300 leading-relaxed">
              {{
                isOwnProfile
                  ? "You haven't provided any social links yet."
                  : "This user hasn't provided any social links yet."
              }}
            </p>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="space-y-8">
          <!-- Popular Tracks -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">
                Popular Tracks
              </h2>
              <NuxtLink
                :to="`/producer/${userData.id}/all-tracks`"
                class="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold text-sm md:text-base"
              >
                See all
                <Icon name="ph:caret-right" class="text-lg" />
              </NuxtLink>
            </div>

            <!-- Tracks Grid -->
            <div
              v-if="popularTracks.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <div
                v-for="track in popularTracks"
                :key="track.id"
                class="group cursor-pointer"
              >
                <div
                  class="relative aspect-square mb-3 rounded-lg overflow-hidden"
                >
                  <img
                    :src="track.coverImage"
                    :alt="track.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <!-- Waveform animation when playing -->
                  <div
                    v-if="playingBeatId === String(track.id) && isPlaying"
                    @click.stop="togglePlay(track)"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                  >
                    <div class="flex items-end gap-1 h-10">
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-1"
                      ></div>
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-2"
                      ></div>
                      <div
                        class="w-1 bg-blue-400 rounded-full animate-eq-bar-3"
                      ></div>
                    </div>
                  </div>
                  <!-- Play Overlay -->
                  <div
                    v-else
                    @click.stop="togglePlay(track)"
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div
                      class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Icon
                        name="ph:play-fill"
                        class="text-white text-xl ml-0.5"
                      />
                    </div>
                  </div>
                </div>
                <NuxtLink :to="`/beat/${track.id}`">
                  <p
                    class="text-sm font-semibold text-white truncate mb-1 hover:text-blue-400 transition-colors"
                  >
                    {{ track.title }}
                  </p>
                </NuxtLink>
                <p class="text-xs text-gray-400 truncate">
                  {{ track.genre }}
                </p>
                <p class="text-sm font-bold text-blue-400 mt-2">
                  ${{ track.priceBasic }}
                </p>
              </div>
            </div>
            <p v-else class="text-gray-400 text-center py-8">
              {{
                isOwnProfile
                  ? "You haven't uploaded any beats yet."
                  : "This user hasn't uploaded any beats yet."
              }}
            </p>
          </div>

          <!-- Playlists -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">
                Playlists
              </h2>
              <button
                class="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold text-sm md:text-base"
              >
                See all
                <Icon name="ph:caret-right" class="text-lg" />
              </button>
            </div>

            <!-- Playlists Grid -->
            <div
              v-if="playlists.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <div
                v-for="playlist in playlists"
                :key="playlist.id"
                class="group cursor-pointer"
              >
                <div
                  class="relative aspect-square mb-3 rounded-lg overflow-hidden"
                >
                  <img
                    :src="playlist.coverImage"
                    :alt="playlist.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <!-- Play Overlay -->
                  <div
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div
                      class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Icon
                        name="ph:play-fill"
                        class="text-white text-xl ml-0.5"
                      />
                    </div>
                  </div>
                </div>
                <p class="text-sm font-semibold text-white truncate mb-1">
                  {{ playlist.title }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ playlist.trackCount }} tracks
                </p>
              </div>
            </div>
            <p v-else class="text-gray-400 text-center py-8">
              {{
                isOwnProfile
                  ? "You haven't created any playlists yet."
                  : "This user hasn't created any playlists yet."
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <BackToTop />
  </div>
</template>

<script setup>
const route = useRoute();
const profileId = route.params.id;

// Beat player state
const { playingBeatId, isPlaying, togglePlay } = useBeatPlayer();

// Fetch logged-in user to check if viewing own profile
const currentUser = await useCurrentUser();

// Fetch profile by user ID
const {
  data: userData,
  pending,
  error,
} = await useFetch(`/api/profile/${profileId}`);

// Check if this is the logged-in user's own profile
const isOwnProfile = computed(() => currentUser?.id === profileId);

// Parse social links
const socialLinks = computed(() => {
  if (!userData.value?.socialLinks) return {};

  if (typeof userData.value.socialLinks === "string") {
    try {
      return JSON.parse(userData.value.socialLinks);
    } catch (e) {
      return {};
    }
  }

  return userData.value.socialLinks || {};
});

const hasSocialLinks = computed(() => {
  return !!(
    socialLinks.value.instagram ||
    socialLinks.value.soundcloud ||
    socialLinks.value.youtube
  );
});

// Fetch beats by profile ID - skip if no userData
const { data: beatsData } = await useFetch(() =>
  userData.value ? `/api/producers/${userData.value.id}/beats` : null,
);

// Popular tracks - use first 5 beats
const popularTracks = computed(() => {
  if (!beatsData.value?.beats) return [];
  return beatsData.value.beats.slice(0, 5);
});

// Sync popular tracks to audio player playlist
usePlaylistSync(popularTracks);

// Playlists - temporarily use beats (will implement playlists later)
const playlists = computed(() => {
  if (!beatsData.value?.beats) return [];
  return beatsData.value.beats.slice(0, 5).map((beat) => ({
    id: beat.id,
    title: beat.title,
    trackCount: 1, // TODO: Implement actual playlist track count
    coverImage: beat.coverImage,
  }));
});

// Format member since date
const formatMemberSince = (date) => {
  if (!date) return "Recently";
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};
</script>

<style scoped>
/* Animated Equalizer Bars */
@keyframes eq-bar-1 {
  0%,
  100% {
    height: 16px;
  }
  50% {
    height: 40px;
  }
}

@keyframes eq-bar-2 {
  0%,
  100% {
    height: 24px;
  }
  50% {
    height: 52px;
  }
}

@keyframes eq-bar-3 {
  0%,
  100% {
    height: 20px;
  }
  50% {
    height: 48px;
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

<template>
  <div class="min-h-screen pt-12">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-[#0f1219] py-12 md:py-20 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <div class="mb-6">
          <BackButton />
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="animate-pulse text-center">
          <div class="flex justify-center mb-6">
            <div
              class="h-28 w-28 md:h-36 md:w-36 bg-gray-800 rounded-full"
            ></div>
          </div>
          <div class="h-8 bg-gray-800 rounded w-64 mx-auto mb-4"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-10">
          <Icon
            name="ph:warning-circle"
            class="text-red-400 text-6xl mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p class="text-gray-400 mb-4">
            This profile doesn't exist or has been removed.
          </p>
          <NuxtLink
            to="/discover"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            <Icon name="ph:arrow-left" size="20" />
            Back to Discover
          </NuxtLink>
        </div>

        <!-- Profile Info -->
        <div v-else-if="profileData" class="text-center">
          <!-- Profile Picture -->
          <div class="flex justify-center mb-4">
            <div
              class="h-28 w-28 md:h-44 md:w-44 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-blue-500/20 shadow-xl"
            >
              <img
                v-if="profileData.profilePicture"
                :src="profileData.profilePicture"
                :alt="profileData.username"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else
                name="mdi:account-circle"
                class="w-20 md:w-32 h-20 md:h-32 text-gray-300"
              />
            </div>
          </div>

          <!-- Username -->
          <NuxtLink
            :to="`/profile/${profileId}`"
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight hover:underline block"
          >
            @{{ profileData.username }}
          </NuxtLink>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Liked Tracks
          </p>

          <!-- Stats -->
          <div class="flex items-center justify-center gap-6 mb-8">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-blue-400">
                {{ likedBeats.length }}
              </div>
              <div class="text-sm text-gray-400 font-medium">
                {{ likedBeats.length === 1 ? "Track" : "Tracks" }}
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <SearchInput v-model="searchQuery" />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div
      v-if="profileData && !pending && !error"
      class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
    >
      <div>
        <!-- Header -->
        <div class="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
              {{
                isOwnProfile
                  ? "All Liked Tracks by you"
                  : `All Liked Tracks by @${profileData.username}`
              }}
            </h2>
            <p class="text-sm md:text-base text-gray-400">
              {{ filteredBeats.length }}
              {{ filteredBeats.length === 1 ? "track" : "tracks" }}
              {{ searchQuery ? "found" : "liked" }}
            </p>
          </div>
        </div>

        <!-- Beats List -->
        <BeatsList
          :beats="filteredBeats"
          v-model:current-page="currentPage"
          :search-query="searchQuery"
          :show-producer="true"
          :pending="likePending"
          :has-beats="likedBeats.length > 0"
          empty-message="This profile hasn't liked any beats yet."
          @clear-search="searchQuery = ''"
          @open-license-modal="openLicenseModal"
        />
      </div>
    </div>

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
definePageMeta({
  title: "Liked Tracks",
});

const route = useRoute();
const profileId = route.params.id;

// Get current user to check if viewing own profile
const currentUser = await useCurrentUser();
const isOwnProfile = computed(() => currentUser?.id === profileId);

// Fetch profile info (route param is userId, profile.id is the DB profile id)
const {
  data: profileData,
  pending,
  error,
} = await useFetch(`/api/profile/${profileId}`);

// Set dynamic title based on profile username
usePageTitle(
  () =>
    profileData.value?.username
      ? `${profileData.value.username}'s Likes`
      : undefined,
  "Liked Tracks",
);

// Redirect if liked tracks are private and viewer is not the owner
if (
  profileData.value &&
  !isOwnProfile.value &&
  profileData.value.likedTracksPublic === false
) {
  await navigateTo("/unauthorized?reason=private-liked-tracks");
}

// Fetch all liked beats — must use the DB profile id, not the userId from the URL
const { data: likedData, pending: likePending } = await useFetch(() =>
  profileData.value
    ? `/api/interactions/likes/profile/${profileData.value.id}`
    : null,
);

const likedBeats = computed(() => likedData.value?.beats ?? []);

// Sync liked beats to audio player
usePlaylistSync(likedBeats);

// Search
const searchQuery = ref("");
const currentPage = ref(1);

const filteredBeats = computed(() => {
  if (!searchQuery.value.trim()) return likedBeats.value;
  const query = searchQuery.value.toLowerCase().trim();
  return likedBeats.value.filter(
    (beat) =>
      beat.title.toLowerCase().includes(query) ||
      beat.producer.toLowerCase().includes(query) ||
      beat.genre?.toLowerCase().includes(query) ||
      beat.tags?.some((tag) => tag.toLowerCase().includes(query)),
  );
});

// Reset page on search
watch(searchQuery, () => {
  currentPage.value = 1;
});

// License modal
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
</script>

<template>
  <nav class="bg-[#161b33] border-b border-gray-800 shadow-lg">
    <div class="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo + Navigation -->
        <div class="flex items-center gap-8">
          <!-- Logo -->
          <NuxtLink
            to="/discover"
            class="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow"
            >
              <Icon name="mdi:music-note" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xl font-bold">
              <span class="text-white">Beat</span>
              <span class="text-blue-500">Stack</span>
            </span>
          </NuxtLink>

          <!-- Navigation Links -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/discover"
              class="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              active-class="text-white"
            >
              Discover
            </NuxtLink>

            <!-- Dashboard Link -->
            <NuxtLink
              v-if="userProfile?.role === 'PRODUCER'"
              to="/dashboard"
              class="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              active-class="text-white"
            >
              Dashboard
            </NuxtLink>
          </nav>
        </div>

        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <!-- Shopping Cart -->
          <button
            class="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label="Shopping Cart"
          >
            <Icon
              name="material-symbols-light:shopping-bag-outline"
              class="w-8 h-8"
            />
          </button>

          <!-- Loading Skeleton -->
          <template v-if="loading">
            <div class="hidden sm:block animate-pulse">
              <div class="w-20 h-6 bg-gray-700 rounded"></div>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
          </template>

          <!-- User Info (Loaded) -->
          <template v-else>
            <!-- Username -->
            <span class="text-gray-300 font-medium hidden sm:block">
              {{ username }}
            </span>

            <!-- Profile Picture -->
            <NuxtLink
              to="/settings"
              class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 hover:ring-2 hover:ring-blue-500 transition-all duration-200 flex items-center justify-center overflow-hidden"
              aria-label="Profile Settings"
            >
              <img
                v-if="userProfile?.profilePicture"
                :src="userProfile.profilePicture"
                :alt="username"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else
                name="mdi:account-circle"
                class="w-8 h-8 text-gray-300"
              />
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Session data from authentication (contains user info from cookies)
const { data: session } = useAuth();

// Global state - persists across page navigation and component remounts
// Using useState ensures data and loading state are cached together
const userProfile = useState("userProfile", () => null);
const username = useState("username", () => "User");
const loading = useState("navbarLoading", () => true);

// Fetch user profile when user ID is available
watch(
  () => session.value?.user?.id,
  async (userId) => {
    if (userId && !userProfile.value) {
      // User logged in but profile not cached - fetch from API
      loading.value = true;
      const profile = await $fetch(`/api/profile/${userId}`);
      userProfile.value = profile;
      username.value = profile.username;
      loading.value = false;
    } else if (userProfile.value) {
      // Profile already cached - stop loading immediately
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>

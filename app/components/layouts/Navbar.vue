<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-[#161b33] border-b border-gray-800 shadow-lg"
  >
    <div class="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo + Navigation -->
        <div class="flex items-center gap-8">
          <!-- Logo with Hamburger -->
          <div class="flex items-center gap-3">
            <!-- Hamburger Menu Button (Mobile only) -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 -ml-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              aria-label="Menu"
            >
              <Icon name="ph:list" class="w-7 h-7" />
            </button>

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
              <span class="text-xl font-bold hidden sm:block">
                <span class="text-white">Beat</span>
                <span class="text-blue-500">Stack</span>
              </span>
            </NuxtLink>
          </div>

          <!-- Navigation Links (Desktop only) -->
          <nav class="hidden md:flex items-center gap-6">
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
          <!-- Shopping Cart (Only for authenticated users) -->
          <button
            v-if="currentUser"
            class="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label="Shopping Cart"
          >
            <Icon
              name="material-symbols-light:shopping-bag-outline"
              class="w-8 h-8"
            />
          </button>

          <!-- Notifications (Only for authenticated users) -->
          <NotificationDropdown v-if="currentUser && !loading" />

          <!-- Loading Skeleton -->
          <template v-if="loading">
            <div class="hidden sm:block animate-pulse">
              <div class="w-20 h-6 bg-gray-700 rounded"></div>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
          </template>

          <!-- Guest User (Not Logged In) -->
          <template v-else-if="!currentUser">
            <div class="flex items-center gap-2">
              <NuxtLink
                to="/auth/login"
                class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Sign Up
              </NuxtLink>
            </div>
          </template>

          <!-- Authenticated User -->
          <template v-else>
            <!-- Username -->
            <span class="text-gray-300 font-medium hidden sm:block">
              {{ username }}
            </span>

            <!-- User Dropdown Menu (Hidden on mobile) -->
            <div class="hidden md:block">
              <UserDropdown :userProfile="userProfile" :username="username" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Component -->
    <MobileMenu
      :is-open="isMobileMenuOpen"
      :current-user="currentUser"
      :user-profile="userProfile"
      :username="username"
      @close="closeMobileMenu"
    />
  </nav>
</template>

<script setup>
// Fetch user data - handles both OAuth and JWT via cookies
const { data: currentUser, pending: loading } = await useFetch(
  "/api/auth/user",
  {
    credentials: "include",
    lazy: true,
    server: false,
  },
);

// User profile data
const userProfile = useState("userProfile", () => null);
const username = useState("username", () => "User");

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Close mobile menu when route changes
watch(
  () => useRoute().path,
  () => {
    closeMobileMenu();
  },
);

// Fetch user profile when user is available
watch(
  () => currentUser.value?.id,
  async (userId) => {
    if (userId && !userProfile.value) {
      try {
        const profile = await $fetch(`/api/profile/${userId}`);
        userProfile.value = profile;
        username.value = profile.username;
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
  },
  { immediate: true },
);
</script>

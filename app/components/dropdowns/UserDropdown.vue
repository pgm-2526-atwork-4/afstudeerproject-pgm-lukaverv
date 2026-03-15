<template>
  <div class="relative" ref="dropdownRef">
    <!-- Profile Picture Button -->
    <button
      @click="toggleDropdown"
      class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 hover:ring-2 hover:ring-blue-500 transition-all duration-200 flex items-center justify-center overflow-hidden"
      aria-label="User Menu"
    >
      <img
        v-if="userProfile?.profilePicture"
        :src="userProfile.profilePicture"
        :alt="username"
        class="w-full h-full object-cover"
      />
      <Icon v-else name="mdi:account-circle" class="w-8 h-8 text-gray-300" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-56 bg-[#1e2441] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
      >
        <!-- User Info Section -->
        <div class="px-4 py-3 border-b border-gray-700">
          <p class="text-sm text-gray-300">Signed in as</p>
          <p class="text-sm font-medium text-white truncate">
            {{ username }}
          </p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <!-- Profile -->
          <NuxtLink
            :to="`/profile/${userProfile?.userId}`"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="mdi:account" class="w-5 h-5" />
            <span>Profile</span>
          </NuxtLink>

          <!-- Notifications -->
          <NuxtLink
            to="/notifications"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="ph:bell" class="w-5 h-5" />
            <span>Notifications</span>
          </NuxtLink>

          <!-- Liked Tracks -->
          <NuxtLink
            :to="`/profile/${userProfile?.userId}/liked-tracks`"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="ph:heart" class="w-5 h-5" />
            <span>Liked Tracks</span>
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink
            to="/settings"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="mdi:cog" class="w-5 h-5" />
            <span>Settings</span>
          </NuxtLink>

          <!-- Dashboard (only for Producer) -->
          <NuxtLink
            v-if="userProfile?.role === 'PRODUCER'"
            to="/dashboard"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="mdi:view-dashboard" class="w-5 h-5" />
            <span>Dashboard</span>
          </NuxtLink>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <Icon name="mdi:logout" class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  userProfile: {
    type: Object,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// Dropdown state
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

// Toggle dropdown menu
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close dropdown menu
const { logout } = useLogout();

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Handle logout
const handleLogout = async () => {
  closeDropdown();
  await logout();
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      closeDropdown();
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<template>
  <!-- Mobile Menu Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
    ></div>
  </Transition>

  <!-- Mobile Menu Slide Panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 bottom-0 w-72 bg-[#161b33] border-r border-gray-700 shadow-2xl z-50 md:hidden overflow-y-auto"
    >
      <!-- Header with Close Button -->
      <div
        class="h-16 flex items-center justify-between px-4 border-b border-gray-700"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30"
          >
            <Icon name="mdi:music-note" class="w-6 h-6 text-white" />
          </div>
          <span class="text-xl font-bold">
            <span class="text-white">Beat</span>
            <span class="text-blue-500">Stack</span>
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
          aria-label="Close Menu"
        >
          <Icon name="ph:x" class="w-7 h-7" />
        </button>
      </div>

      <!-- Menu Content -->
      <div class="p-6">
        <!-- User Info Section (if logged in) -->
        <div
          v-if="session?.user && userProfile"
          class="mb-6 pb-6 border-b border-gray-700"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
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
                class="w-10 h-10 text-gray-300"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{{ username }}</p>
              <p class="text-xs text-gray-400 capitalize">
                {{ userProfile?.role?.toLowerCase() || "User" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-2 mb-6">
          <NuxtLink
            to="/discover"
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            active-class="bg-blue-600/10 text-blue-400"
          >
            <Icon name="ph:compass" class="w-5 h-5" />
            <span class="font-medium">Discover</span>
          </NuxtLink>

          <NuxtLink
            v-if="userProfile?.role === 'PRODUCER'"
            to="/dashboard"
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            active-class="bg-blue-600/10 text-blue-400"
          >
            <Icon name="mdi:view-dashboard" class="w-5 h-5" />
            <span class="font-medium">Dashboard</span>
          </NuxtLink>
        </nav>

        <!-- User Actions (if logged in) -->
        <div
          v-if="session?.user"
          class="space-y-2 pt-6 border-t border-gray-700"
        >
          <NuxtLink
            to="/settings"
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="mdi:cog" class="w-5 h-5" />
            <span class="font-medium">Settings</span>
          </NuxtLink>

          <NuxtLink
            to="/profile/edit"
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="mdi:account-edit" class="w-5 h-5" />
            <span class="font-medium">Edit Profile</span>
          </NuxtLink>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <Icon name="mdi:logout" class="w-5 h-5" />
            <span class="font-medium">Logout</span>
          </button>
        </div>

        <!-- Guest Actions (if not logged in) -->
        <div v-else class="space-y-3 pt-6 border-t border-gray-700">
          <NuxtLink
            to="/auth/login"
            @click="$emit('close')"
            class="block w-full px-4 py-3 text-center font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            @click="$emit('close')"
            class="block w-full px-4 py-3 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  session: {
    type: Object,
    default: null,
  },
  userProfile: {
    type: Object,
    default: null,
  },
  username: {
    type: String,
    default: "User",
  },
});

const emit = defineEmits(["close"]);

const { signOut } = useAuth();

// Handle logout from mobile menu
const handleLogout = async () => {
  emit("close");
  await signOut({ callbackUrl: "/auth/login" });

  // Clear cached user data
  const userProfile = useState("userProfile");
  const username = useState("username");
  const loading = useState("navbarLoading");

  userProfile.value = null;
  username.value = "User";
  loading.value = true;
};
</script>

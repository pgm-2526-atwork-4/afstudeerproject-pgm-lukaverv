<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
      aria-label="Notifications"
    >
      <Icon name="ph:bell" class="w-6 h-6" />
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1e2441] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
        >
          <h3 class="text-sm font-semibold text-white">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllRead"
            class="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Mark All As Read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading" class="p-6 text-center">
            <Icon
              name="svg-spinners:ring-resize"
              class="w-6 h-6 text-blue-500 mx-auto"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else-if="notifications.length === 0"
            class="p-8 text-center text-gray-400"
          >
            <Icon
              name="ph:bell-slash"
              class="w-10 h-10 mx-auto mb-2 opacity-50"
            />
            <p class="text-sm">No notifications yet</p>
          </div>

          <!-- Notification Items -->
          <div v-else>
            <NotificationItem
              v-for="notif in notifications.slice(0, 8)"
              :key="notif.id"
              :notification="notif"
              :compact="true"
              @click="handleNotificationClick"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-700">
          <NuxtLink
            to="/notifications"
            @click="closeDropdown"
            class="block px-4 py-3 text-center text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            All Notifications
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const {
  unreadCount,
  notifications,
  loading,
  fetchUnreadCount,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} = useNotifications();

const isOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await fetchNotifications();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleMarkAllRead = async () => {
  await markAllAsRead();
};

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    await markAsRead(notif.id);
  }
  closeDropdown();

  const path = navigateFromNotification(notif);
  if (path) {
    navigateTo(path);
  }
};

// Poll for unread count every 30 seconds
let pollInterval;
onMounted(() => {
  fetchUnreadCount();
  pollInterval = setInterval(fetchUnreadCount, 30000);

  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      closeDropdown();
    }
  };
  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    clearInterval(pollInterval);
    document.removeEventListener("click", handleClickOutside);
  });
});

const userProfile = useState("userProfile");
watch(
  () => userProfile.value?.id,
  (newId) => {
    if (newId) fetchUnreadCount();
  },
);
</script>

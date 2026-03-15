<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Clear All Confirmation Modal -->
    <ClearNotificationsModal
      v-model="showClearModal"
      :count="notifications.length"
      @confirm="handleClearAll"
    />
    <!-- Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
            >
              NOTIFICATIONS
            </h1>
            <p class="text-lg md:text-xl text-gray-300">
              Stay updated with your latest activity
            </p>
          </div>
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllRead"
            class="hidden md:flex px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium items-center gap-2"
          >
            <Icon name="ph:check-circle" class="w-5 h-5" />
            Mark All Read
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div>
        <!-- Toolbar -->
        <div
          class="flex items-center justify-center md:justify-end mb-6 gap-3 flex-wrap"
        >
          <!-- Mobile mark all read -->
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllRead"
            class="md:hidden text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Mark All Read
          </button>

          <!-- Clear all -->
          <button
            v-if="notifications.length > 0"
            @click="showClearModal = true"
            class="flex items-center gap-1.5 px-3 py-2 text-sm text-white hover:text-red-400 border border-gray-700/50 hover:border-red-500/40 rounded-lg transition-colors bg-[#1a1f35] hover:bg-red-500/10"
          >
            <Icon name="ph:trash" size="15" />
            Clear All
          </button>

          <!-- Type filter -->
          <div class="relative">
            <select
              v-model="filterType"
              class="appearance-none bg-[#1a1f35] text-white border border-gray-700/50 rounded-lg px-3 py-2 pr-8 text-sm outline-none cursor-pointer hover:bg-[#252b45] transition-all"
            >
              <option value="all">All Notifications</option>
              <option value="LIKE">Likes</option>
              <option value="COMMENT">Comments</option>
              <option value="FOLLOW">Follows</option>
            </select>
            <Icon
              name="ph:caret-down"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size="14"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="animate-pulse flex items-center gap-4 p-5 bg-[#1e2441] rounded-xl"
          >
            <div class="w-11 h-11 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredNotifications.length === 0"
          class="text-center py-20"
        >
          <div
            class="w-20 h-20 bg-[#1e2441] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Icon name="ph:bell-slash" class="w-10 h-10 text-gray-500" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">
            {{
              filterType === "all"
                ? "No notifications yet"
                : "No notifications of this type"
            }}
          </h2>
          <p class="text-gray-400 max-w-md mx-auto">
            {{
              filterType === "all"
                ? "When someone interacts with your content, you'll see it here."
                : "Try selecting a different filter."
            }}
          </p>
        </div>

        <!-- Notification list with pagination -->
        <Pagination
          v-else
          :items="filteredNotifications"
          v-model:page="currentPage"
          :items-per-page="10"
          item-label="notifications"
          :per-page-options="[10, 20, 50]"
        >
          <template #default="{ items }">
            <div class="space-y-2 mb-4">
              <NotificationItem
                v-for="notif in items as any[]"
                :key="notif.id"
                :notification="notif"
                :show-actions="true"
                @click="handleNotificationClick"
                @toggle-read="handleToggleRead"
                @delete="handleDeleteNotification"
              />
            </div>
          </template>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: "Notifications", middleware: "auth" });

const {
  unreadCount,
  notifications,
  loading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  toggleRead,
  deleteNotification,
  clearAll,
} = useNotifications();

const filterType = ref("all");
const currentPage = ref(1);
const showClearModal = ref(false);

const filteredNotifications = computed(() => {
  if (filterType.value === "all") return notifications.value;
  return notifications.value.filter((n: any) => n.type === filterType.value);
});

watch(filterType, () => {
  currentPage.value = 1;
});

const handleMarkAllRead = async () => {
  await markAllAsRead();
};

const handleClearAll = async () => {
  await clearAll();
};

const handleDeleteNotification = async (notif: any) => {
  await deleteNotification(notif.id);
};

const handleNotificationClick = async (notif: any) => {
  if (!notif.isRead) {
    await markAsRead(notif.id);
  }
  const path = navigateFromNotification(notif);
  if (path) navigateTo(path);
};

const handleToggleRead = async (notif: any) => {
  await toggleRead(notif.id, notif.isRead);
};

onMounted(() => {
  fetchNotifications();
});
</script>

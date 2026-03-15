<template>
  <div class="relative" :class="compact ? '' : 'rounded-xl'">
    <!-- Main clickable area -->
    <button
      @click="handleClick"
      class="w-full flex items-start gap-3 text-left transition-colors rounded-xl"
      :class="[
        compact
          ? [
              'px-4 py-3 hover:bg-gray-800/50',
              !notification.isRead ? 'bg-blue-900/10' : '',
            ]
          : [
              'p-4 sm:p-5 hover:bg-white/[0.03]',
              !notification.isRead
                ? 'border-l-2 border-blue-500'
                : 'border-l-2 border-transparent',
            ],
      ]"
    >
      <!-- Actor Avatar -->
      <div class="flex-shrink-0 relative">
        <div
          class="rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
          :class="compact ? 'w-10 h-10' : 'w-11 h-11'"
        >
          <img
            v-if="notification.actor?.profilePicture"
            :src="notification.actor.profilePicture"
            :alt="notification.actor.username"
            class="w-full h-full object-cover"
          />
          <Icon
            v-else
            name="mdi:account-circle"
            class="w-8 h-8 text-gray-400"
          />
        </div>
        <!-- Type badge -->
        <div
          class="absolute -bottom-1 -right-1 bg-blue-600 rounded-full flex items-center justify-center shadow-md"
          :class="compact ? 'w-5 h-5' : 'w-6 h-6'"
        >
          <Icon :name="typeIcon" class="w-3 h-3 text-white" />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0" :class="showActions ? 'pr-8' : ''">
        <p class="text-sm text-gray-200 leading-snug">
          <span class="font-semibold text-white">{{
            notification.actor?.username
          }}</span>
          {{ message }}
        </p>
        <p class="text-xs text-gray-400 mt-1">{{ timeAgo }}</p>
      </div>

      <!-- Unread dot (compact only) -->
      <div
        v-if="!notification.isRead && compact"
        class="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5"
      />
    </button>

    <!-- 3-dots context menu (non-compact page view) -->
    <div v-if="showActions" class="absolute top-3 right-3" @click.stop>
      <!-- Click-outside backdrop -->
      <div
        v-if="isActionsOpen"
        class="fixed inset-0 z-[9]"
        @click="isActionsOpen = false"
      />

      <button
        @click="isActionsOpen = !isActionsOpen"
        class="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-colors"
      >
        <Icon name="ph:dots-three-vertical" class="w-4 h-4" />
      </button>

      <Transition name="dropdown">
        <div
          v-if="isActionsOpen"
          class="absolute right-0 top-full mt-1 w-48 bg-[#1a1f35] border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
        >
          <button
            @click.stop="handleToggleRead"
            class="w-full px-4 py-2.5 text-sm text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2.5"
          >
            <Icon
              :name="notification.isRead ? 'ph:envelope' : 'ph:envelope-open'"
              class="w-4 h-4 flex-shrink-0"
            />
            {{ notification.isRead ? "Mark as unread" : "Mark as read" }}
          </button>
          <div class="mx-3 my-1 border-t border-gray-700/50" />
          <button
            @click.stop="handleDelete"
            class="w-full px-4 py-2.5 text-sm text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2.5"
          >
            <Icon name="ph:trash" class="w-4 h-4 flex-shrink-0" />
            Delete notification
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  notification: any;
  compact?: boolean;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  click: [notification: any];
  toggleRead: [notification: any];
  delete: [notification: any];
}>();

const isActionsOpen = ref(false);
const { formatTimeAgo } = useFormatters();

const message = computed(() => getNotificationMessage(props.notification));
const typeIcon = computed(() => getNotificationIcon(props.notification.type));
const timeAgo = computed(() => formatTimeAgo(props.notification.createdAt));

const handleClick = () => {
  emit("click", props.notification);
};

const handleToggleRead = () => {
  isActionsOpen.value = false;
  emit("toggleRead", props.notification);
};

const handleDelete = () => {
  isActionsOpen.value = false;
  emit("delete", props.notification);
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
.dropdown-enter-active > div,
.dropdown-leave-active > div {
  transition: transform 0.2s ease;
}
.dropdown-enter-from > div,
.dropdown-leave-to > div {
  transform: scale(0.95) translateY(-4px);
  opacity: 0;
}
</style>

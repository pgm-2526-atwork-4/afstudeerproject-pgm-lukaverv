<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="close"
        />

        <!-- Modal -->
        <div
          class="relative bg-dark-800 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md overflow-hidden"
        >
          <!-- Header -->
          <div class="p-6 border-b border-gray-700/50">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center"
              >
                <Icon name="ph:bell-slash" class="w-6 h-6 text-red-500" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white mb-1">
                  Clear all notifications?
                </h3>
                <p class="text-sm text-gray-400">
                  This will permanently delete all
                  <span class="text-white font-semibold">{{ count }}</span>
                  {{ count === 1 ? "notification" : "notifications" }}. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 flex gap-3 justify-end">
            <button
              @click="close"
              class="px-6 py-2.5 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium outline-none select-none"
            >
              Cancel
            </button>
            <button
              @click="confirm"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium outline-none select-none flex items-center gap-2"
            >
              <Icon name="ph:trash" class="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; count: number }>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const close = () => emit("update:modelValue", false);
const confirm = () => {
  emit("confirm");
  close();
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>

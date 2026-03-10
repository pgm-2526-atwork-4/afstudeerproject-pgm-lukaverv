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
        ></div>

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
                <svg
                  class="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white mb-1">
                  {{ title }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-if="itemName" class="px-6 py-4 bg-dark-900/50">
            <p class="text-sm text-gray-300">
              <span class="text-white font-semibold">"{{ itemName }}"</span>
            </p>
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
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium outline-none select-none"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Delete Item?",
  message: "This action cannot be undone.",
  itemName: "",
  confirmText: "Delete",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const close = () => {
  emit("update:modelValue", false);
};

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
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

button {
  -webkit-tap-highlight-color: transparent;
}
</style>

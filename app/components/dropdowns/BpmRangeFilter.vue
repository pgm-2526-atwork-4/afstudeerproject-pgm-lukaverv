<template>
  <div class="relative">
    <button
      @click="$emit('toggle')"
      class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
    >
      <span class="font-medium">
        BPM
        <span
          v-if="hasFilter"
          class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
        >
          {{ filterLabel }}
        </span>
      </span>
      <Icon
        name="ph:caret-down"
        :class="isOpen ? 'rotate-180' : ''"
        class="transition-transform duration-300 text-gray-400 group-hover:text-blue-400"
      />
    </button>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10 p-4"
      >
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="flex-1">
              <label class="text-gray-400 text-xs mb-1 block">Min BPM</label>
              <input
                v-model.number="localMin"
                type="number"
                :min="40"
                :max="300"
                placeholder="40"
                @input="emitUpdate"
                class="w-full px-3 py-2 rounded-lg text-sm bg-[#0f1219] border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span class="text-gray-500 mt-5">—</span>
            <div class="flex-1">
              <label class="text-gray-400 text-xs mb-1 block">Max BPM</label>
              <input
                v-model.number="localMax"
                type="number"
                :min="40"
                :max="300"
                placeholder="300"
                @input="emitUpdate"
                class="w-full px-3 py-2 rounded-lg text-sm bg-[#0f1219] border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            v-if="hasFilter"
            @click="clearFilter"
            class="w-full text-xs text-gray-400 hover:text-white transition py-1"
          >
            Clear BPM filter
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  minBpm: {
    type: [Number, null],
    default: null,
  },
  maxBpm: {
    type: [Number, null],
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle", "update"]);

const localMin = ref(props.minBpm);
const localMax = ref(props.maxBpm);

const hasFilter = computed(
  () => localMin.value != null || localMax.value != null,
);

const filterLabel = computed(() => {
  if (localMin.value != null && localMax.value != null)
    return `${localMin.value}–${localMax.value}`;
  if (localMin.value != null) return `${localMin.value}+`;
  if (localMax.value != null) return `≤${localMax.value}`;
  return "";
});

const emitUpdate = () => {
  emit("update", {
    min:
      localMin.value === "" || localMin.value == null ? null : localMin.value,
    max:
      localMax.value === "" || localMax.value == null ? null : localMax.value,
  });
};

const clearFilter = () => {
  localMin.value = null;
  localMax.value = null;
  emitUpdate();
};

watch(
  () => props.minBpm,
  (v) => {
    localMin.value = v;
  },
);
watch(
  () => props.maxBpm,
  (v) => {
    localMax.value = v;
  },
);
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}
</style>

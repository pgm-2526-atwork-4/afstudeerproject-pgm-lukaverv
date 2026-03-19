<template>
  <Transition name="slide-down">
    <div
      v-if="showHeader"
      class="fixed top-16 left-0 right-0 bg-[#0f1219]/95 backdrop-blur-lg border-b border-gray-700/50 z-40 shadow-2xl"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div class="flex items-center gap-2 md:gap-4">
          <h2
            class="hidden md:block text-xl font-bold text-white whitespace-nowrap"
          >
            {{ title }}
          </h2>
          <div class="flex-1 relative">
            <Icon
              name="ph:magnifying-glass"
              class="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-sm md:text-base"
              :class="
                hasActiveFilters && !inputValue
                  ? 'text-blue-400'
                  : 'text-gray-400'
              "
            />
            <input
              v-model="inputValue"
              type="text"
              :placeholder="placeholder"
              @keyup.enter="applySearch"
              class="w-full pl-10 md:pl-12 py-2 md:py-3 rounded-lg text-sm bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="inputValue ? 'pr-10 md:pr-4' : 'pr-3 md:pr-4'"
            />
            <!-- Clear input button -->
            <button
              v-if="inputValue"
              @click="clearSearch"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors p-1"
              title="Clear input"
            >
              <Icon name="ph:x" size="16" />
            </button>
          </div>
          <button
            v-if="showButton"
            @click="applySearch"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold whitespace-nowrap text-sm md:text-base"
          >
            SEARCH
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "DISCOVER BEATS",
  },
  placeholder: {
    type: String,
    default: "Search beats...",
  },
  threshold: {
    type: Number,
    default: 400,
  },
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "clear-all"]);

const inputValue = ref("");
const scrolledPastThreshold = ref(false);

const showButton = computed(() => !!inputValue.value || props.hasActiveFilters);

const applySearch = () => {
  emit("update:modelValue", inputValue.value.trim());
};

const clearSearch = () => {
  inputValue.value = "";
  emit("update:modelValue", "");
  emit("clear-all");
};

// Sync input value with model value when cleared from parent
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === "") {
      inputValue.value = "";
    }
  },
);

// Show header only when scrolled past threshold
const showHeader = computed(() => {
  return scrolledPastThreshold.value;
});

const handleScroll = () => {
  scrolledPastThreshold.value = window.scrollY > props.threshold;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

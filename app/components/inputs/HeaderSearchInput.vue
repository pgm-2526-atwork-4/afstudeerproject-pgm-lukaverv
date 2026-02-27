<template>
  <div class="max-w-4xl mx-auto mb-8">
    <div class="relative mb-4 md:mb-0">
      <Icon
        name="ph:magnifying-glass"
        class="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg md:text-xl"
      />
      <input
        v-model="inputValue"
        type="text"
        placeholder="Search by title, producer, genre, or tags..."
        @keyup.enter="applySearch"
        class="w-full pl-12 md:pl-14 py-4 md:py-5 rounded-xl text-base md:text-lg bg-[#161b33] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-lg"
        :class="inputValue ? 'pr-16 md:pr-40' : 'pr-4 md:pr-32'"
      />
      <!-- Clear input button (X icon) -->
      <button
        v-if="inputValue"
        @click="clearSearch"
        type="button"
        class="absolute right-4 md:right-36 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors p-1"
        title="Clear input"
      >
        <Icon name="ph:x" size="24" class="md:hidden" />
        <Icon name="ph:x" size="28" class="hidden md:block" />
      </button>
      <!-- Desktop button (inside input) -->
      <button
        v-if="inputValue"
        @click="applySearch"
        class="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg bg-blue-600 hover:bg-blue-700"
      >
        SEARCH
      </button>
    </div>
    <!-- Mobile button (below input) -->
    <button
      v-if="inputValue"
      @click="applySearch"
      class="md:hidden w-full text-white px-4 py-3 rounded-xl transition font-semibold shadow-lg text-base bg-blue-600 hover:bg-blue-700"
    >
      SEARCH
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Internal input value
const inputValue = ref("");

// Apply search (on Enter or button click)
const applySearch = () => {
  emit("update:modelValue", inputValue.value.trim());
};

// Clear search
const clearSearch = () => {
  inputValue.value = "";
  emit("update:modelValue", "");
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
</script>

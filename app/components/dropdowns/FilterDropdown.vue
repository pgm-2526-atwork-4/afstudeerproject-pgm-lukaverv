<template>
  <div class="relative">
    <button
      @click="$emit('toggle')"
      class="w-full px-6 py-4 rounded-xl bg-[#161b33] border border-gray-700/50 text-white hover:border-blue-500/50 hover:bg-[#1a2040] transition-all duration-200 flex items-center justify-between group shadow-md"
    >
      <span class="font-medium">
        {{ label }}
        <span
          v-if="selectedCount > 0"
          class="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full"
        >
          {{ selectedCount }}
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
        class="absolute top-full mt-2 w-full bg-[#161b33] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
      >
        <div
          :class="gridCols ? `grid ${gridCols}` : ''"
          class="max-h-64 overflow-y-auto"
        >
          <button
            v-for="option in options"
            :key="getOptionValue(option)"
            @click.stop="$emit('select', getOptionValue(option))"
            :class="isSelected(option) ? 'bg-blue-600' : 'hover:bg-blue-600/50'"
            class="w-full px-6 py-3 text-left text-white transition-colors duration-150 flex items-center gap-3"
          >
            <Icon
              :name="isSelected(option) ? 'ph:check-circle-fill' : defaultIcon"
              class="text-blue-400"
            />
            <span>{{ getOptionLabel(option) }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  selectedValues: {
    type: Array,
    default: () => [],
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  defaultIcon: {
    type: String,
    default: "ph:music-notes-simple",
  },
  gridCols: {
    type: String,
    default: "",
  },
  valueKey: {
    type: String,
    default: "",
  },
  labelKey: {
    type: String,
    default: "",
  },
});

defineEmits(["toggle", "select"]);

const selectedCount = computed(() => props.selectedValues.length);

const getOptionValue = (option) => {
  if (props.valueKey && typeof option === "object") {
    return option[props.valueKey];
  }
  return option;
};

const getOptionLabel = (option) => {
  if (props.labelKey && typeof option === "object") {
    return option[props.labelKey];
  }
  return option;
};

const isSelected = (option) => {
  return props.selectedValues.includes(getOptionValue(option));
};
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

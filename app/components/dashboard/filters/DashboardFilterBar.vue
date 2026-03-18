<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div v-if="title || subtitle">
      <h2 v-if="title" class="text-lg sm:text-xl font-bold text-white">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-xs sm:text-sm text-gray-400 mt-1">
        {{ subtitle }}
      </p>
    </div>
    <div
      class="flex items-center gap-3"
      :class="{ 'ml-auto': !title && !subtitle }"
    >
      <!-- Sort dropdown -->
      <div class="relative">
        <select
          :value="sort"
          @change="
            $emit('update:sort', ($event.target as HTMLSelectElement).value)
          "
          class="appearance-none bg-[#1a1f35] text-white border border-gray-700/50 rounded-lg px-3 py-2 pr-8 text-sm outline-none cursor-pointer hover:bg-[#252b45] transition-all"
        >
          <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <Icon
          name="ph:caret-down"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size="14"
        />
      </div>
      <!-- Search -->
      <input
        type="text"
        :value="search"
        @input="
          $emit('update:search', ($event.target as HTMLInputElement).value)
        "
        :placeholder="searchPlaceholder"
        class="appearance-none bg-[#1a1f35] text-white border border-gray-700/50 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 hover:bg-[#252b45] transition-all"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SortOption {
  value: string;
  label: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  sort: string;
  search: string;
  sortOptions: SortOption[];
  searchPlaceholder?: string;
}

withDefaults(defineProps<Props>(), {
  searchPlaceholder: "Search...",
  title: "",
  subtitle: "",
});

defineEmits<{
  "update:sort": [value: string];
  "update:search": [value: string];
}>();
</script>

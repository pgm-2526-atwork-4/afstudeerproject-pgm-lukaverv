<template>
  <div>
    <!-- Slot for paginated items -->
    <slot :items="paginatedItems"></slot>

    <!-- Pagination controls -->
    <div class="mt-8 md:mt-10 px-3 md:px-4">
      <div
        class="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-3 md:gap-4"
      >
        <!-- Showing results -->
        <p class="text-xs md:text-sm text-gray-400 text-center">
          Showing
          <span class="text-white font-medium"
            >{{ startItem }}–{{ endItem }}</span
          >
          of
          <span class="text-white font-medium">{{ total }}</span>
          {{ itemLabel }}
        </p>

        <!-- Page buttons -->
        <nav class="flex items-center justify-center gap-1">
          <!-- Prev -->
          <button
            @click="prevPage"
            :disabled="page === 1"
            :class="
              page === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:text-white hover:bg-[#1a1f35]'
            "
            class="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm text-gray-400 transition-colors"
          >
            <Icon name="ph:caret-left" size="16" />
            <span>Prev</span>
          </button>

          <!-- First page -->
          <button
            v-if="page > 2"
            @click="goToPage(1)"
            class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors"
          >
            1
          </button>

          <!-- Ellipsis before -->
          <span
            v-if="page > 3"
            class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-600 text-xs md:text-sm"
          >
            …
          </span>

          <!-- Page before current -->
          <button
            v-if="page > 1"
            @click="goToPage(page - 1)"
            class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
          >
            {{ page - 1 }}
          </button>

          <!-- Current page -->
          <button
            class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium bg-blue-600 text-white"
          >
            {{ page }}
          </button>

          <!-- Page after current -->
          <button
            v-if="page < totalPages"
            @click="goToPage(page + 1)"
            class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
          >
            {{ page + 1 }}
          </button>

          <!-- Ellipsis after -->
          <span
            v-if="page < totalPages - 2"
            class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 items-center justify-center text-gray-600 text-xs md:text-sm"
          >
            …
          </span>

          <!-- Last page -->
          <button
            v-if="page < totalPages - 1"
            @click="goToPage(totalPages)"
            class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
          >
            {{ totalPages }}
          </button>

          <!-- Next -->
          <button
            @click="nextPage"
            :disabled="page === totalPages"
            :class="
              page === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:text-white hover:bg-[#1a1f35]'
            "
            class="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm text-gray-400 transition-colors"
          >
            <span>Next</span>
            <Icon name="ph:caret-right" size="16" />
          </button>
        </nav>

        <!-- Per page -->
        <div class="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <span>Show</span>
          <select
            :value="itemsPerPage"
            @change="changeItemsPerPage(parseInt($event.target.value))"
            class="bg-[#1a1f35] border border-gray-700/50 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option
              v-for="option in perPageOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <span>per page</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  page: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 12,
  },
  itemLabel: {
    type: String,
    default: "items",
  },
  perPageOptions: {
    type: Array,
    default: () => [12, 24, 48],
  },
});

const emit = defineEmits(["update:page", "update:itemsPerPage"]);

// Total items and pages
const total = computed(() => props.items.length);
const totalPages = computed(() => Math.ceil(total.value / props.itemsPerPage));

// Calculate start and end item numbers
const startItem = computed(() => {
  return (props.page - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.page * props.itemsPerPage, total.value);
});

// Paginated items for slot
const paginatedItems = computed(() => {
  const start = (props.page - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.items.slice(start, end);
});

// Navigation functions
const goToPage = (newPage) => {
  emit("update:page", newPage);
};

const nextPage = () => {
  if (props.page < totalPages.value) {
    emit("update:page", props.page + 1);
  }
};

const prevPage = () => {
  if (props.page > 1) {
    emit("update:page", props.page - 1);
  }
};

const changeItemsPerPage = (newValue) => {
  emit("update:itemsPerPage", newValue);
  emit("update:page", 1); // Reset to first page
};
</script>

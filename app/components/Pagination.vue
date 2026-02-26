<template>
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
        <span class="text-white font-medium">{{ totalItems }}</span>
        {{ itemLabel }}
      </p>

      <!-- Page buttons -->
      <nav class="flex items-center justify-center gap-1">
        <!-- Prev -->
        <button
          @click="$emit('prev')"
          :disabled="currentPage === 1"
          :class="
            currentPage === 1
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
          v-if="currentPage > 2"
          @click="$emit('page', 1)"
          class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors"
        >
          1
        </button>

        <!-- Ellipsis before -->
        <span
          v-if="currentPage > 3"
          class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-600 text-xs md:text-sm"
        >
          …
        </span>

        <!-- Page before current -->
        <button
          v-if="currentPage > 1"
          @click="$emit('page', currentPage - 1)"
          class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
        >
          {{ currentPage - 1 }}
        </button>

        <!-- Current page -->
        <button
          class="w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium bg-blue-600 text-white"
        >
          {{ currentPage }}
        </button>

        <!-- Page after current -->
        <button
          v-if="currentPage < totalPages"
          @click="$emit('page', currentPage + 1)"
          class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
        >
          {{ currentPage + 1 }}
        </button>

        <!-- Ellipsis after -->
        <span
          v-if="currentPage < totalPages - 2"
          class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 items-center justify-center text-gray-600 text-xs md:text-sm"
        >
          …
        </span>

        <!-- Last page -->
        <button
          v-if="currentPage < totalPages - 1"
          @click="$emit('page', totalPages)"
          class="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1f35] transition-colors items-center justify-center"
        >
          {{ totalPages }}
        </button>

        <!-- Next -->
        <button
          @click="$emit('next')"
          :disabled="currentPage === totalPages"
          :class="
            currentPage === totalPages
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
      <div
        v-if="showPerPage"
        class="hidden md:flex items-center gap-2 text-sm text-gray-400"
      >
        <span>Show</span>
        <select
          :value="perPage"
          @change="$emit('perPageChange', parseInt($event.target.value))"
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
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    default: 12,
  },
  itemLabel: {
    type: String,
    default: "items",
  },
  showPerPage: {
    type: Boolean,
    default: true,
  },
  perPageOptions: {
    type: Array,
    default: () => [12, 24, 48],
  },
});

defineEmits(["page", "next", "prev", "perPageChange"]);

const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.totalItems);
});
</script>

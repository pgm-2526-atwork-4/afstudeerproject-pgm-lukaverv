<template>
  <div class="space-y-0">
    <div
      v-for="i in count"
      :key="i"
      class="grid md:grid-cols-[2.5fr_1fr_1fr_2fr_180px] gap-3 md:gap-6 items-start md:items-center px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-none"
    >
      <!-- Title Column -->
      <div
        class="flex items-center gap-3 md:gap-4 min-w-0 col-span-full md:col-span-1"
      >
        <!-- Skeleton Image -->
        <div
          class="h-12 w-12 md:h-14 md:w-14 bg-gray-800 rounded animate-pulse flex-shrink-0"
        ></div>
        <div class="min-w-0 flex-1">
          <!-- Skeleton Title -->
          <div
            class="h-4 md:h-5 bg-gray-800 rounded animate-pulse mb-2"
            :style="{ width: `${60 + ((i * 7) % 40)}%` }"
          ></div>
          <!-- Skeleton Producer -->
          <div
            class="h-3 md:h-4 bg-gray-800 rounded animate-pulse"
            :style="{ width: `${40 + ((i * 5) % 30)}%` }"
          ></div>
          <!-- Mobile meta info -->
          <div class="md:hidden flex items-center gap-3 mt-1">
            <div class="h-3 w-12 bg-gray-800 rounded animate-pulse"></div>
            <div class="h-3 w-3 bg-gray-800 rounded-full animate-pulse"></div>
            <div class="h-3 w-16 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Time Column -->
      <div class="hidden md:block">
        <div class="h-4 w-12 bg-gray-800 rounded animate-pulse"></div>
      </div>

      <!-- BPM Column -->
      <div class="hidden md:block">
        <div class="h-4 w-10 bg-gray-800 rounded animate-pulse"></div>
      </div>

      <!-- Tags Column -->
      <div class="hidden md:flex flex-wrap gap-2">
        <div class="h-7 w-16 bg-gray-800 rounded-md animate-pulse"></div>
        <div class="h-7 w-20 bg-gray-800 rounded-md animate-pulse"></div>
      </div>

      <!-- Action Column -->
      <div
        class="flex items-center gap-2 md:gap-3 col-span-full md:col-span-1 mt-2 md:mt-0"
      >
        <!-- Mobile tags -->
        <div class="md:hidden flex flex-wrap gap-1.5 flex-1">
          <div class="h-6 w-14 bg-gray-800 rounded animate-pulse"></div>
          <div class="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <!-- Skeleton Button -->
        <div class="h-9 w-20 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 12,
  },
});
</script>

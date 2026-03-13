<template>
  <div class="bg-dark-800 rounded-xl p-8 shadow-2xl animate-pulse">
    <!-- Header row -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="h-7 w-28 bg-gray-700/60 rounded mb-3"></div>
        <div class="h-10 w-16 bg-gray-700/60 rounded"></div>
        <div class="h-4 w-20 bg-gray-700/40 rounded mt-2"></div>
      </div>
      <!-- Period selector placeholder -->
      <div class="h-9 w-32 bg-gray-700/50 rounded-lg"></div>
    </div>

    <!-- Tab row -->
    <div class="flex gap-6 border-b border-gray-700/30 mb-6 pb-3">
      <div
        v-for="i in 4"
        :key="i"
        class="h-3.5 rounded bg-gray-700/50"
        :style="{ width: tabWidths[i - 1] + 'px' }"
      ></div>
    </div>

    <!-- Chart bars -->
    <div class="h-80 flex items-end gap-2 px-4 pb-8">
      <div
        v-for="(height, i) in barHeights"
        :key="i"
        class="flex-1 rounded bg-gray-700/50"
        :style="{ height: height + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const barHeights = [42, 28, 65, 38, 55, 72, 33];
const tabWidths = [36, 32, 56, 44];
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Loading skeleton -->
    <div v-if="loading" class="absolute inset-0 flex items-end gap-2 px-2 pb-6">
      <div
        v-for="(h, i) in skeletonHeights"
        :key="i"
        class="flex-1 rounded animate-pulse bg-gray-700/40"
        :style="{ height: h + '%' }"
      />
    </div>
    <!-- Chart -->
    <ClientOnly v-else>
      <Line :data="data" :options="options" />
      <template #fallback>
        <div class="absolute inset-0 bg-dark-700/30 rounded animate-pulse" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
);

const props = withDefaults(
  defineProps<{
    data: ChartData<"line">;
    options: ChartOptions<"line">;
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  {
    loading: false,
    skeletonCount: 12,
  },
);

const skeletonHeights = computed(() =>
  Array.from({ length: props.skeletonCount }, () => 20 + Math.random() * 55),
);
</script>

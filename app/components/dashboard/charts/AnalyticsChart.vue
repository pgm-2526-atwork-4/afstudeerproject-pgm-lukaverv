<template>
  <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
    <!-- Header with total plays and change -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1">Analytics</h2>
        <div class="flex items-center gap-3 mt-3">
          <span class="text-4xl font-bold text-white">{{ currentTotal }}</span>
          <span v-if="pending" class="text-xs text-gray-500 animate-pulse"
            >Loading...</span
          >
        </div>
        <p class="text-sm text-gray-400 mt-1">{{ periodLabel }}</p>
      </div>
      <PeriodFilter v-model="selectedPeriod" />
    </div>

    <!-- Tabs -->
    <div class="flex gap-6 border-b border-gray-700/30 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'pb-3 text-sm font-medium transition-all duration-300 relative outline-none select-none',
          activeTab === tab.id ? '' : 'text-gray-400 hover:text-gray-300',
        ]"
        :style="activeTab === tab.id ? { color: 'rgb(59, 130, 246)' } : {}"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-slideIn"
        ></div>
      </button>
    </div>

    <!-- Chart -->
    <div class="relative h-80">
      <!-- Loading skeleton -->
      <div
        v-if="pending"
        class="absolute inset-0 flex items-end gap-2 px-4 pb-8"
      >
        <div
          v-for="i in skeletonBars"
          :key="i"
          class="flex-1 rounded animate-pulse bg-gray-700/50"
          :style="{ height: skeletonHeights[i - 1] + '%' }"
        ></div>
      </div>
      <!-- Chart -->
      <Bar v-else :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import type { ChartOptions } from "chart.js";

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const activeTab = ref("plays");
const selectedPeriod = ref("week");

const tabs = [
  { id: "plays", label: "Plays" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "follows", label: "Follows" },
  { id: "sales", label: "Sales" },
];

// Fetch real chart data from the API, re-fetches when period changes
const { data: apiData, pending } = await useFetch(
  () => `/api/dashboard/chart?period=${selectedPeriod.value}`,
);

const periodLabel = computed(() => {
  const labels: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };
  return labels[selectedPeriod.value] || "This Week";
});

const currentTotal = computed(() => {
  if (!apiData.value) return 0;
  const data = (apiData.value as any)[activeTab.value] as number[] | undefined;
  return data?.reduce((sum, val) => sum + val, 0) ?? 0;
});

// Skeleton bars for loading state — random heights to look organic
const skeletonBars = computed(() =>
  selectedPeriod.value === "all" ? 5 : selectedPeriod.value === "year" ? 12 : 7,
);
const skeletonHeights = computed(() =>
  Array.from({ length: skeletonBars.value }, () => 20 + Math.random() * 55),
);

const chartData = computed(() => {
  const labels = apiData.value?.labels ?? [];
  const data: number[] = apiData.value
    ? (((apiData.value as any)[activeTab.value] as number[]) ?? [])
    : [];
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
        barThickness: selectedPeriod.value === "all" ? 40 : 60,
      },
    ],
  };
});

/**
 * Compute a realistic Y-axis max so that the chart never feels "full" just
 * because of a handful of plays. Rules:
 *   - Real max of the dataset is used as the baseline.
 *   - We add ~30 % headroom so bars never touch the top.
 *   - The axis always shows at least a minimum scale (10 for plays, 5 for
 *     the others) so the chart looks proportionate when counts are tiny.
 *   - Values are rounded up to a "nice" number (nearest 5 / 10 / 50 …)
 *     so the grid lines stay clean.
 */
const yAxisMax = computed(() => {
  const data: number[] = apiData.value
    ? (((apiData.value as any)[activeTab.value] as number[]) ?? [])
    : [];
  const realMax = Math.max(0, ...data);

  // Minimum axis ceiling per metric — gives the illusion of scale
  const minimums: Record<string, number> = {
    plays: 10,
    likes: 5,
    comments: 5,
    follows: 5,
    sales: 1,
  };
  const minCeiling = minimums[activeTab.value] ?? 5;

  // 30 % headroom on top of the actual max
  const withHeadroom = Math.ceil(realMax * 1.3);

  // Use whichever is larger
  const raw = Math.max(minCeiling, withHeadroom);

  // Round up to a "nice" step so grid lines are round numbers
  const step =
    raw <= 10 ? 1 : raw <= 50 ? 5 : raw <= 200 ? 10 : raw <= 1000 ? 50 : 100;
  return Math.ceil(raw / step) * step;
});

const chartOptions = computed<ChartOptions<"bar">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#374151",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (ctx) => ctx[0]?.label || "",
        label: (ctx) => `${activeTab.value}: ${ctx.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#9CA3AF", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      max: yAxisMax.value,
      grid: { color: "rgba(75, 85, 99, 0.2)" },
      ticks: {
        color: "#9CA3AF",
        font: { size: 11 },
        // Only show integer ticks
        callback: (val) => (Number.isInteger(val) ? val : undefined),
      },
    },
  },
}));
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
  transform-origin: left;
}
</style>

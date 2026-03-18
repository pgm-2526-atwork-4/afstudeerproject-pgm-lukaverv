<template>
  <div class="bg-dark-800 rounded-xl p-6 md:p-8 shadow-2xl">
    <!-- Header with period, total revenue, and total sales -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-3">Sales Overview</h2>
        <div class="flex items-center gap-6">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Sales
            </p>
            <span class="text-2xl font-bold text-white">{{ totalSales }}</span>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <span class="text-2xl font-bold text-green-400"
              >${{ totalRevenue.toFixed(2) }}</span
            >
          </div>
        </div>
        <p class="text-sm text-gray-400 mt-2">{{ periodLabel }}</p>
      </div>
      <PeriodFilter v-model="period" />
    </div>

    <!-- Chart -->
    <div class="h-80">
      <LineChart :data="chartData" :options="chartOptions" :loading="pending" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  period: string;
}>();

const emit = defineEmits<{
  "update:period": [value: string];
}>();

const period = computed({
  get: () => props.period,
  set: (value) => emit("update:period", value),
});

// Fetch chart data from the API
const { data: apiData, pending } = await useFetch(
  () => `/api/dashboard/sales-chart?period=${period.value}`,
);

const periodLabel = computed(() => {
  const labels: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };
  return labels[period.value] || "This Week";
});

const totalSales = computed(() => {
  return (apiData.value as any)?.totalSales ?? 0;
});

const totalRevenue = computed(() => {
  return (apiData.value as any)?.totalRevenue ?? 0;
});

const chartData = computed<ChartData<"line">>(() => {
  const labels = apiData.value?.labels ?? [];
  const data: number[] = apiData.value
    ? (((apiData.value as any).revenues as number[]) ?? [])
    : [];
  return {
    labels,
    datasets: [
      {
        data,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "rgba(34, 197, 94, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };
});

const yAxisMax = computed(() => {
  const data: number[] = apiData.value
    ? (((apiData.value as any).revenues as number[]) ?? [])
    : [];
  const realMax = Math.max(0, ...data);

  const minCeiling = 10;
  const withHeadroom = Math.ceil(realMax * 1.3);
  const raw = Math.max(minCeiling, withHeadroom);

  const step =
    raw <= 10 ? 1 : raw <= 50 ? 5 : raw <= 200 ? 10 : raw <= 1000 ? 50 : 100;
  return Math.ceil(raw / step) * step;
});

const chartOptions = computed<ChartOptions<"line">>(() => ({
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
        label: (ctx) => {
          const amount = ctx.parsed.y ?? 0;
          return `Revenue: $${amount.toFixed(2)}`;
        },
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
        callback: (val) => `$${val}`,
      },
    },
  },
}));
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>

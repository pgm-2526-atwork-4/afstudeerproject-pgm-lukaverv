<template>
  <div>
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4"
    >
      <h2
        class="text-base md:text-lg font-bold text-white flex items-center gap-2"
      >
        <Icon name="ph:chart-bar" class="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        Audience Retention
      </h2>
      <div
        class="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm"
      >
        <div class="flex items-center gap-1.5 sm:gap-2">
          <Icon name="ph:clock" class="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
          <span class="text-gray-400">Avg. Duration:</span>
          <span class="text-white font-semibold">{{ avgViewDuration }}</span>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span class="text-gray-400">Retention:</span>
          <span class="text-white font-semibold"
            >{{ avgPercentageViewed }}%</span
          >
        </div>
      </div>
    </div>
    <div class="h-px bg-gray-700/30 mb-4 md:mb-5"></div>

    <!-- Legend -->
    <div
      class="flex items-center gap-3 sm:gap-5 mb-3 sm:mb-4 text-xs text-gray-400"
    >
      <div class="flex items-center gap-1.5">
        <div class="w-4 sm:w-6 h-0.5 bg-blue-500 rounded-full"></div>
        <span>This beat</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-4 sm:w-6 h-0.5 bg-gray-500 rounded-full opacity-60"></div>
        <span>Typical retention</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-48 sm:h-56 md:h-64">
      <div
        v-if="!hasData"
        class="h-full flex items-center justify-center text-gray-500 text-sm"
      >
        <div class="text-center">
          <Icon
            name="ph:chart-line"
            class="text-3xl mb-2 mx-auto text-gray-600"
          />
          <p>
            No retention data yet. Plays will appear here once listeners start
            playing this beat.
          </p>
        </div>
      </div>
      <LineChart v-else :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartOptions, ChartData } from "chart.js";

const props = withDefaults(
  defineProps<{
    duration?: number;
    avgViewDuration?: string;
    avgPercentageViewed?: number;
    beatRetention?: number[];
    typicalRetention?: number[];
  }>(),
  {
    duration: 180,
    avgViewDuration: "0:00",
    avgPercentageViewed: 0,
    beatRetention: () => [],
    typicalRetention: () => [],
  },
);

const hasData = computed(
  () =>
    props.beatRetention.length > 0 && props.beatRetention.some((v) => v > 0),
);

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const chartData = computed<ChartData<"line">>(() => {
  const points = props.beatRetention.length;
  const labels = Array.from({ length: points }, (_, i) =>
    formatTime((i / (points - 1)) * props.duration),
  );

  return {
    labels,
    datasets: [
      {
        label: "Typical retention",
        data: props.typicalRetention,
        borderColor: "rgba(107, 114, 128, 0.4)",
        backgroundColor: "rgba(75, 85, 99, 0.15)",
        fill: true,
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
      {
        label: "This beat",
        data: props.beatRetention,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        fill: true,
        borderWidth: 1.5,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 3,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<"line">>(
  (): ChartOptions<"line"> => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15, 18, 25, 0.92)",
        titleColor: "#9CA3AF",
        bodyColor: "#F3F4F6",
        borderColor: "rgba(55, 65, 81, 0.5)",
        borderWidth: 1,
        padding: 8,
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${Math.round(ctx.parsed.y ?? 0)}%`,
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { color: "rgba(55, 65, 81, 0.25)" },
        ticks: {
          color: "#4B5563",
          maxTicksLimit: 3,
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        min: 0,
        max: 100,
        border: { display: false },
        grid: { color: "rgba(55, 65, 81, 0.25)" },
        ticks: {
          color: "#4B5563",
          stepSize: 50,
          callback: (value) => value + "%",
        },
      },
    },
  }),
);
</script>

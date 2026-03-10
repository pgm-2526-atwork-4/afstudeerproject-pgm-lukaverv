<template>
  <div class="bg-dark-800 rounded-xl p-8 shadow-2xl">
    <!-- Header with total plays and change -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1">Analytics</h2>
        <div class="flex items-center gap-3 mt-3">
          <span class="text-4xl font-bold text-white">{{ currentTotal }}</span>
          <span class="text-sm text-red-500 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            {{ changePercentage }}
          </span>
        </div>
        <p class="text-sm text-gray-400 mt-1">{{ periodLabel }}</p>
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="selectedPeriod"
          class="bg-dark-700 text-white border border-dark-600 rounded-lg px-3 py-2 text-sm outline-none select-none cursor-pointer hover:bg-dark-600 transition-all"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-6 border-b border-dark-700 mb-6">
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
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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
const changePercentage = ref("75.74%");

const tabs = [
  { id: "plays", label: "Plays" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "follows", label: "Follows" },
];

// Hardcoded data for different periods (Monday to Sunday for week)
const periodData = {
  week: {
    plays: [8, 12, 15, 10, 5, 8, 12],
    likes: [3, 5, 7, 4, 2, 3, 6],
    comments: [1, 1, 2, 1, 0, 1, 2],
    follows: [2, 3, 4, 2, 1, 2, 3],
    labels: ["Mon 4", "Tue 5", "Wed 6", "Thu 7", "Fri 8", "Sat 9", "Sun 10"],
  },
  month: {
    plays: [45, 52, 48, 55],
    likes: [18, 22, 20, 25],
    comments: [5, 7, 6, 8],
    follows: [12, 15, 13, 17],
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  },
  year: {
    plays: [120, 145, 160, 155, 170, 185, 195, 210, 205, 220, 230, 245],
    likes: [50, 60, 65, 62, 70, 75, 80, 85, 82, 88, 92, 98],
    comments: [15, 18, 20, 19, 22, 24, 25, 27, 26, 28, 30, 32],
    follows: [30, 35, 38, 37, 40, 43, 45, 48, 47, 50, 52, 55],
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  all: {
    plays: [520, 680, 840, 920, 1050],
    likes: [210, 280, 340, 380, 425],
    comments: [65, 85, 105, 115, 130],
    follows: [140, 180, 220, 245, 280],
    labels: ["2022", "2023", "2024", "2025", "2026"],
  },
};

// Compute period label
const periodLabel = computed(() => {
  const labels: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };
  return labels[selectedPeriod.value] || "This Week";
});

// Compute current total based on selected period and tab
const currentTotal = computed(() => {
  const data = periodData[selectedPeriod.value as keyof typeof periodData];
  const tabData = (data as any)[activeTab.value] as number[];
  return tabData.reduce((sum, val) => sum + val, 0);
});

const chartData = computed(() => {
  const data = periodData[selectedPeriod.value as keyof typeof periodData];
  return {
    labels: data.labels,
    datasets: [
      {
        data: (data as any)[activeTab.value] as number[],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
        barThickness: selectedPeriod.value === "all" ? 40 : 60,
      },
    ],
  };
});

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#374151",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (context) => context[0]?.label || "",
        label: (context) => `${activeTab.value}: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#9CA3AF",
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(75, 85, 99, 0.2)",
      },
      ticks: {
        color: "#9CA3AF",
        font: {
          size: 11,
        },
        stepSize: 2,
      },
    },
  },
};
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

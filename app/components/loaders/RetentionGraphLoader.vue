<template>
  <div class="animate-pulse">
    <!-- Header row (matches RetentionGraph header) -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4"
    >
      <div class="h-5 w-40 bg-gray-700/60 rounded"></div>
      <div class="flex items-center gap-4">
        <div class="h-4 w-28 bg-gray-700/40 rounded"></div>
        <div class="h-4 w-20 bg-gray-700/40 rounded"></div>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-700/30 mb-4 md:mb-5"></div>

    <!-- Legend placeholders -->
    <div class="flex items-center gap-5 mb-3 sm:mb-4">
      <div class="flex items-center gap-1.5">
        <div class="w-6 h-0.5 bg-gray-700/60 rounded-full"></div>
        <div class="h-3 w-14 bg-gray-700/40 rounded"></div>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-6 h-0.5 bg-gray-700/40 rounded-full"></div>
        <div class="h-3 w-24 bg-gray-700/40 rounded"></div>
      </div>
    </div>

    <!-- Chart area with wavy line skeleton -->
    <div class="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-sm">
      <svg
        class="w-full h-full"
        viewBox="0 0 500 160"
        preserveAspectRatio="none"
      >
        <!-- Typical retention fill (gray area) -->
        <path
          d="M0,40 C60,45 120,55 180,60 C240,65 300,72 360,78 C400,82 450,85 500,88 L500,160 L0,160 Z"
          class="fill-gray-700/20"
        />
        <path
          d="M0,40 C60,45 120,55 180,60 C240,65 300,72 360,78 C400,82 450,85 500,88"
          fill="none"
          stroke-width="1"
          class="stroke-gray-600/25"
        />
        <!-- Beat retention fill (slightly higher retention curve) -->
        <path
          d="M0,35 C50,28 100,40 160,38 C210,36 260,50 320,55 C370,60 430,65 500,70 L500,160 L0,160 Z"
          class="fill-gray-700/30"
        />
        <path
          d="M0,35 C50,28 100,40 160,38 C210,36 260,50 320,55 C370,60 430,65 500,70"
          fill="none"
          stroke-width="1.5"
          class="stroke-gray-600/45"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</template>

<template>
  <div class="bg-dark-800 rounded-xl p-6 md:p-8 shadow-2xl animate-pulse">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="h-7 w-36 bg-gray-700/60 rounded mb-3"></div>
        <div class="flex items-center gap-6">
          <div>
            <div class="h-3 w-20 bg-gray-700/40 rounded mb-2"></div>
            <div class="h-8 w-10 bg-gray-700/60 rounded"></div>
          </div>
          <div>
            <div class="h-3 w-24 bg-gray-700/40 rounded mb-2"></div>
            <div class="h-8 w-16 bg-gray-700/60 rounded"></div>
          </div>
        </div>
        <div class="h-3.5 w-20 bg-gray-700/40 rounded mt-2"></div>
      </div>
      <!-- Period selector placeholder -->
      <div class="h-9 w-32 bg-gray-700/50 rounded-lg flex-shrink-0"></div>
    </div>

    <!-- Line graph skeleton -->
    <div class="relative h-80">
      <!-- Y-axis tick labels -->
      <div
        class="absolute left-0 top-0 bottom-8 flex flex-col justify-between pr-2"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="h-2.5 w-8 bg-gray-700/40 rounded"
        ></div>
      </div>

      <!-- Chart area -->
      <div
        class="absolute left-10 right-0 top-0 bottom-8 overflow-hidden rounded-sm"
      >
        <svg
          class="w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <!-- Fill area under line -->
          <path
            d="M0,160 C40,150 70,80 110,90 C145,100 175,50 220,65 C260,78 295,110 330,95 C360,82 385,100 400,92 L400,200 L0,200 Z"
            class="fill-gray-700/30"
          />
          <!-- Line itself -->
          <path
            d="M0,160 C40,150 70,80 110,90 C145,100 175,50 220,65 C260,78 295,110 330,95 C360,82 385,100 400,92"
            fill="none"
            stroke-width="2.5"
            class="stroke-gray-600/50"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Dot points on line -->
          <circle cx="110" cy="90" r="4" class="fill-gray-600/50" />
          <circle cx="220" cy="65" r="4" class="fill-gray-600/50" />
          <circle cx="330" cy="95" r="4" class="fill-gray-600/50" />
        </svg>
      </div>

      <!-- X-axis tick labels -->
      <div class="absolute left-10 right-0 bottom-0 flex justify-between">
        <div
          v-for="i in 7"
          :key="i"
          class="h-2.5 w-8 bg-gray-700/40 rounded"
        ></div>
      </div>
    </div>
  </div>
</template>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4"
  >
    <div class="max-w-md w-full text-center">
      <!-- Icon -->
      <div class="mb-8">
        <svg
          class="mx-auto h-24 w-24 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="text-4xl font-bold text-white mb-4">Access Denied</h1>

      <!-- Message -->
      <p class="text-gray-400 mb-8 text-lg">
        Sorry, you don't have permission to access this page. This area is
        restricted to producers only.
      </p>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/discover"
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          Discover Beats
        </NuxtLink>
        <NuxtLink
          to="/profile"
          class="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
        >
          Go to Profile
        </NuxtLink>
      </div>

      <!-- Help Text -->
      <p class="mt-8 text-sm text-gray-500">
        Want to become a producer?
        <NuxtLink to="/profile" class="text-primary-500 hover:text-primary-400">
          Update your profile
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  layout: false, // No layout for this page
});
</script>

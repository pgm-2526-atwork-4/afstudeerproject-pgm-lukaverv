<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white mb-6">Producer Dashboard</h1>

    <div class="bg-dark-800 rounded-lg p-6 border border-dark-700">
      <p class="text-gray-300">
        Welcome to your producer dashboard! This is where you can manage your
        beats.
      </p>

      <div class="mt-6">
        <NuxtLink
          to="/profile"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors inline-block"
        >
          Go to Profile
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is protected by the producer-only middleware
// Only producers can access this page
definePageMeta({
  middleware: "producer-only",
});
</script>

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
        {{ message }}
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
          v-if="profileUrl"
          :to="profileUrl"
          class="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
        >
          Go to Profile
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const user = await useCurrentUser();
const profileUrl = user ? `/profile/${user.id}` : null;

const reason = route.query.reason as string | undefined;

const message = computed(() => {
  if (reason === "private-liked-tracks") {
    return "This user has set their liked tracks to private.";
  }
  if (reason === "producers-only") {
    return "This area is restricted to producers only.";
  }
  return "You don't have permission to access this page.";
});
</script>

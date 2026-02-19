<template>
  <div
    class="landing-page flex flex-col items-center justify-center min-h-screen"
  >
    <h1 class="text-3xl font-semibold mb-4">Welcome to BeatStack</h1>
    <p class="text-base mb-8">
      Your platform for managing, selling, and analyzing music beats.
    </p>

    <div class="actions flex flex-col space-y-4">
      <div>
        <NuxtLink
          to="/auth/login"
          class="btn px-6 py-2 border border-gray-300 rounded"
          >Login</NuxtLink
        >
      </div>
      <div>
        <NuxtLink
          to="/auth/register"
          class="btn px-6 py-2 border border-gray-300 rounded"
          >Register</NuxtLink
        >
      </div>
      <div>
        <button
          @click="continueAsGuest"
          class="btn px-6 py-2 border border-gray-300 rounded"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

// Navigate to discover page as guest
const continueAsGuest = () => {
  router.push("/discover");
};
</script>

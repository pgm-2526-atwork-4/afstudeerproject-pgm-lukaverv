<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <AuthLogo />

    <!-- Verification Status Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl text-center"
    >
      <h2 class="text-3xl font-bold text-white mb-6">
        {{ status === "success" ? "Email Verified!" : "Verification Failed" }}
      </h2>

      <div v-if="status === 'success'">
        <div class="flex flex-col items-center">
          <Icon name="mdi-check-circle" class="h-16 w-16 text-green-500 mb-4" />
          <p class="text-gray-400 mb-6">
            Your email is now verified! Thanks for signing up!
          </p>
          <button
            @click="redirectToLogin()"
            class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
          >
            Continue
          </button>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-col items-center">
          <Icon name="bx:bxs-error-alt" class="h-16 w-16 text-red-500 mb-4" />
          <p class="text-red-400">
            Verification failed. Please try again or contact support if the
            issue persists.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const { redirectToLogin } = useRedirectToLogin();

// Read the status from the query parameter (passed from /api/verify)
const status = computed(() => route.query.status || "error");
</script>

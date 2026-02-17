<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <h1 class="text-2xl font-semibold mb-4">
        {{ status === "success" ? "Email Verified!" : "Email Verification" }}
      </h1>

      <div
        v-if="status === 'loading'"
        class="text-gray-600 flex flex-col items-center"
      >
        <div class="animate-spin h-16 w-16 text-gray-800 mt-4">
          <Icon name="mdi-loading" class="h-full w-full" />
          <!-- Centered loading icon -->
        </div>
        <p>Verifying your email...</p>
      </div>

      <div v-else-if="status === 'success'">
        <div class="flex flex-col items-center">
          <Icon name="mdi-check-circle" class="h-16 w-16 text-green-500 mb-4" />
          <p class="text-gray-600 mb-4">
            Your email is now verified! Thanks for signing up!
          </p>
          <button
            @click="redirectToLogin()"
            class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Continue
          </button>
        </div>
      </div>

      <div v-else-if="status === 'error'">
        <div class="flex flex-col items-center">
          <Icon name="bx:bxs-error-alt" class="h-16 w-16 text-red-500 mb-4" />
          <p class="text-red-600">
            Verification failed. Please try again or contact support if the
            issue persists.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const status = ref("loading");
const route = useRoute();

const { redirectToLogin } = useRedirectToLogin();

onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    status.value = "error";
    return;
  }

  const { error } = await useFetch(`/api/verify?token=${token}`);

  status.value = error.value ? "error" : "success";
});
</script>

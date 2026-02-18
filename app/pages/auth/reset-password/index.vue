<template>
  <div
    class="reset-password-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Reset Password</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Enter your new password below
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >New Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your new password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <p v-if="message" class="text-green-500 text-sm">{{ message }}</p>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          :disabled="loading"
        >
          <span v-if="loading">Resetting...</span>
          <span v-else>Reset Password</span>
        </button>
      </form>

      <div class="text-center mt-4 text-sm text-gray-600">
        Remember your password?
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline"
          >Sign In</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state management
const route = useRoute();
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle the password reset form submission
const handleSubmit = async () => {
  try {
    loading.value = true; // Start loading state

    // Validate inputs
    if (password.value !== confirmPassword.value) {
      throw new Error("Passwords do not match.");
    }

    // Extract token from query parameters and send request to reset password
    const token = route.query.token;
    if (!token) {
      throw new Error("Invalid or missing token.");
    }

    await $fetch("/api/reset-password", {
      method: "POST",
      body: { token, password: password.value },
    });

    // Success message
    message.value = "Your password has been reset successfully.";
  } catch (err) {
    // Handle errors
    error.value = err.message || "Failed to reset password. Please try again.";
  } finally {
    loading.value = false; // End loading state
  }
};
</script>

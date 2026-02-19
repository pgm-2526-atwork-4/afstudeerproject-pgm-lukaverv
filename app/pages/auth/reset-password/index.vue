<template>
  <div
    class="reset-password-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Reset Password</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Enter your new password below
      </p>

      <VForm class="space-y-4" @submit="handleSubmit">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >New Password</label
          >
          <VField
            id="password"
            name="password"
            type="password"
            as="input"
            placeholder="Enter your new password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            rules="required|min:8|max:128"
          />
          <VErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <VField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            as="input"
            placeholder="Confirm your new password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            rules="required|min:8|max:128"
          />
          <VErrorMessage
            name="confirmPassword"
            class="text-red-500 text-sm mt-1"
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
      </VForm>

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
const message = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle the password reset form submission
const handleSubmit = async (values) => {
  try {
    error.value = ""; // Clear previous errors
    message.value = ""; // Clear previous messages

    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      error.value = "Passwords do not match.";
      return;
    }

    loading.value = true; // Start loading state

    // Extract token from query parameters and send request to reset password
    const token = route.query.token;
    if (!token) {
      throw new Error("Invalid or missing token.");
    }

    await $fetch("/api/reset-password", {
      method: "POST",
      body: { token, password: values.password },
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

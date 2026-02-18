<template>
  <div
    class="forgot-password-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Forgot Password</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Enter your email to receive a password reset link
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="e.g username@gmail.com"
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
          <span v-if="loading">Sending...</span>
          <span v-else>Send Reset Link</span>
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
const email = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle the forgot password form submission
const handleSubmit = async () => {
  try {
    loading.value = true; // Start loading state
    message.value = ""; // Clear previous messages
    error.value = "";

    // Send the email to the backend API
    await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value }),
    });

    // Success message
    message.value = "A password reset link has been sent to your email.";
  } catch (err) {
    // Handle errors
    error.value = "Failed to send reset link. Please try again.";
  } finally {
    loading.value = false; // End loading state
  }
};
</script>

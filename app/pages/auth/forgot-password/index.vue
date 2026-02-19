<template>
  <div
    class="forgot-password-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <AuthLogo />

    <!-- Forgot Password Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl"
    >
      <h2 class="text-3xl font-bold text-white mb-2">Forgot Password</h2>
      <p class="text-gray-400 text-sm mb-6">
        Enter your email to receive a password reset link
      </p>

      <VForm class="space-y-4" @submit="handleSubmit">
        <AuthEmailInput />

        <p v-if="message" class="text-green-400 text-sm">{{ message }}</p>
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
          :disabled="loading"
        >
          <span v-if="loading">Sending...</span>
          <span v-else>Send Reset Link</span>
        </button>
      </VForm>

      <!-- Sign In Link -->
      <div class="text-center mt-6 text-sm text-gray-400">
        Remember your password?
        <NuxtLink
          to="/auth/login"
          class="text-blue-500 hover:text-blue-400 transition font-medium"
          >Sign In</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state management
const message = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle the forgot password form submission
const handleSubmit = async (values) => {
  try {
    loading.value = true;
    message.value = "";
    error.value = "";

    await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: values.email }),
    });

    message.value = "A password reset link has been sent to your email.";
  } catch (err) {
    error.value = "Failed to send reset link. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

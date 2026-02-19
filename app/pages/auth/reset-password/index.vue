<template>
  <div
    class="reset-password-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <AuthLogo />

    <!-- Reset Password Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl"
    >
      <h2 class="text-3xl font-bold text-white mb-2">Reset Password</h2>
      <p class="text-gray-400 text-sm mb-6">Enter your new password below</p>

      <VForm class="space-y-4" @submit="handleSubmit">
        <AuthPasswordInput
          name="password"
          label="New Password"
          placeholder="Enter your new password"
          rules="required|min:8|max:128"
          autocomplete="new-password"
        />

        <AuthPasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          rules="required|confirmed:@password"
          autocomplete="new-password"
        />

        <p v-if="message" class="text-green-400 text-sm">{{ message }}</p>
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
          :disabled="loading"
        >
          <span v-if="loading">Resetting...</span>
          <span v-else>Reset Password</span>
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
const route = useRoute();
const message = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle the password reset form submission
const handleSubmit = async (values) => {
  try {
    error.value = "";
    message.value = "";

    loading.value = true;

    const token = route.query.token;
    if (!token) {
      throw new Error("Invalid or missing token.");
    }

    await $fetch("/api/reset-password", {
      method: "POST",
      body: { token, password: values.password },
    });

    message.value = "Your password has been reset successfully.";
  } catch (err) {
    error.value = err.message || "Failed to reset password. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="forgot-password-page flex flex-col items-center justify-center min-h-screen"
  >
    <h1 class="text-2xl font-semibold mb-4">Forgot Password</h1>
    <p class="text-base mb-6">Enter your email to reset your password.</p>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col space-y-4 w-full max-w-md"
    >
      <input
        v-model="email"
        type="email"
        placeholder="Email address"
        class="px-4 py-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        class="btn px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send Reset Link
      </button>
    </form>

    <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "", // User's email input
      message: "", // Success message
      error: "", // Error message
    };
  },
  methods: {
    async handleSubmit() {
      try {
        // Clear previous messages
        this.message = "";
        this.error = "";

        // Send POST request to the API
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email }),
        });

        // Handle response
        if (!response.ok) {
          throw new Error("Failed to send reset link. Please try again.");
        }

        // Show success message
        this.message = "A password reset link has been sent to your email.";
      } catch (err) {
        // Show error message
        this.error = err.message;
      }
    },
  },
};
</script>

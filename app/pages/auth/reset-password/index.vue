<template>
  <div
    class="reset-password-page flex flex-col items-center justify-center min-h-screen"
  >
    <h1 class="text-2xl font-semibold mb-4">Reset Password</h1>
    <p class="text-base mb-6">Enter your new password below.</p>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col space-y-4 w-full max-w-md"
    >
      <input
        v-model="password"
        type="password"
        placeholder="New Password"
        class="px-4 py-2 border border-gray-300 rounded"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="px-4 py-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        class="btn px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Password
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
      password: "",
      confirmPassword: "",
      message: "",
      error: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        // Clear previous messages
        this.message = "";
        this.error = "";

        // Validate passwords match
        if (this.password !== this.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        // Get token from query params
        const token = this.$route.query.token;
        if (!token) {
          throw new Error("Invalid or missing token.");
        }

        // Send POST request to reset password
        const response = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password: this.password }),
        });

        if (!response.ok) {
          throw new Error("Failed to reset password. Please try again.");
        }

        // Show success message
        this.message = "Your password has been reset successfully.";
      } catch (err) {
        // Show error message
        this.error = err.message;
      }
    },
  },
};
</script>

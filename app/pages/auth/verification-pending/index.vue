<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <Logo />

    <!-- Verification Pending Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl text-center"
    >
      <h2 class="text-3xl font-bold text-white mb-4">Verify Your Email</h2>
      <p class="text-gray-400 mb-6">
        Please verify your email to continue. Check your inbox for the
        verification email.
      </p>
      <button
        @click="resendVerificationEmail"
        :disabled="loading"
        class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Sending...</span>
        <span v-else>Resend Verification Email</span>
      </button>
      <div class="mt-6">
        <button
          @click="goBack"
          class="flex items-center justify-center w-full text-gray-400 hover:text-gray-300 transition"
        >
          <span class="mr-2">←</span> Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import necessary composables for route and navigation handling
const route = useRoute();
const { goBack } = useNavigation();

// Reactive variables for managing state
const loading = ref(false);
const userEmail = route.query.email || "";

// Function to resend the verification email
const resendVerificationEmail = async () => {
  if (!userEmail) {
    alert("No email found. Please register again.");
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/resend-verification", {
      method: "POST",
      body: { email: userEmail },
    });
    alert(
      "A new verification email has been sent to your inbox. Please check your email and follow the instructions to verify your account.",
    );
  } catch (error) {
    alert(
      error.data?.message ||
        "Failed to resend verification email. Please try again later.",
    );
  } finally {
    loading.value = false;
  }
};
</script>

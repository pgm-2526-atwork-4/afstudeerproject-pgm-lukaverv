<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <h1 class="text-2xl font-semibold mb-4">Verify Your Email</h1>
      <p class="text-gray-600 mb-4">
        Please verify your email to continue. Check your inbox for the
        verification email.
      </p>
      <button
        @click="resendVerificationEmail"
        class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
      >
        Resend Verification Email
      </button>
    </div>
  </div>
</template>

<script setup>
const resendVerificationEmail = async () => {
  return alert(
    "A new verification email has been sent to your inbox. Please check your email and follow the instructions to verify your account.",
  );
};
</script>

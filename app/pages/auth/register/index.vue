<template>
  <div
    class="register-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Register</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Create your account to get started
      </p>

      <VForm class="space-y-4" @submit="handleRegister">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <VField
            id="email"
            name="email"
            type="email"
            as="input"
            placeholder="e.g username@gmail.com"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            rules="required|email|max:255"
          />
          <VErrorMessage name="email" class="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <VField
            id="password"
            name="password"
            type="password"
            as="input"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            rules="required|min:8|max:128"
          />
          <VErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-sm">{{ success }}</p>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          :disabled="loading"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
      </VForm>

      <div class="text-center mt-4 text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline"
          >Sign In</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for state management
const error = ref("");
const success = ref("");
const loading = ref(false);

// Function to handle user registration
const handleRegister = async (values) => {
  try {
    loading.value = true; // Indicate that the registration process is ongoing
    error.value = ""; // Clear previous errors

    // Send registration data to the backend
    await $fetch("/api/register", {
      method: "POST",
      body: { email: values.email, password: values.password },
    });

    // On successful registration, redirect to the verification-pending page with the email
    success.value = "Account created successfully! Please verify your email.";
    navigateTo(
      `/auth/verification-pending?email=${encodeURIComponent(values.email)}`,
    );
  } catch (err) {
    error.value =
      err.data?.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false; // Reset loading state
  }
};
</script>

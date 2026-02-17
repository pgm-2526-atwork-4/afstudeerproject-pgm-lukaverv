<template>
  <div
    class="register-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Register</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Create your account to get started
      </p>

      <form class="space-y-4" @submit.prevent="handleRegister">
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
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          :disabled="loading"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
      </form>

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
import { ref } from "vue";
import { useRouter } from "vue-router";

// Reactive variables for form inputs and state management
const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

// Router instance for navigation
const router = useRouter();

// Function to handle user registration
const handleRegister = async () => {
  try {
    loading.value = true; // Indicate that the registration process is ongoing

    // Send registration data to the backend
    const response = await $fetch("/api/register", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // On successful registration, show a success message and navigate to the login page
    success.value = "Account created successfully! Redirecting to login...";
    router.push("/auth/login");
  } catch (err) {
    error.value =
      err.data?.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false; // Reset loading state
  }
};
</script>

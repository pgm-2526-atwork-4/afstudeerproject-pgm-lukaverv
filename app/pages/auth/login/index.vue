<template>
  <div
    class="login-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Sign In</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Enter your credentials to continue
      </p>

      <form class="space-y-4" @submit.prevent="handleLogin">
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
            autocomplete="email"
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
            autocomplete="current-password"
          />
          <div class="text-right mt-1">
            <NuxtLink
              to="/forgot-password"
              class="text-sm text-blue-500 hover:underline"
              >Forgot password?</NuxtLink
            >
          </div>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          :disabled="loading"
        >
          <span v-if="loading">Signing In...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="text-center mt-4 text-sm text-gray-600">
        New here?
        <NuxtLink to="/auth/register" class="text-blue-500 hover:underline"
          >Create</NuxtLink
        >
        your account.<br />
        Continue as guest.
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state management
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

// Function to handle user login
const handleLogin = async () => {
  try {
    loading.value = true; // Indicate that the login process is ongoing

    // Send login credentials to the backend
    const response = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // On successful login, store the token and redirect to discover
    if (response && response.user) {
      localStorage.setItem("token", response.token);
      await navigateTo("/discover", { replace: true });
    } else {
      error.value = "Invalid email or password. Please try again.";
    }
  } catch (err) {
    error.value = "An error occurred during login. Please try again.";
  } finally {
    loading.value = false; // Reset loading state
  }
};
</script>

<template>
  <div
    class="login-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Sign In</h1>
      <p class="text-center text-sm text-gray-600 mb-6">
        Enter your credentials to continue
      </p>

      <VForm class="space-y-4" @submit="handleLogin">
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
            rules="required|email"
            autocomplete="email"
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
            rules="required|min:8"
            autocomplete="current-password"
          />
          <VErrorMessage name="password" class="text-red-500 text-sm mt-1" />
          <div class="text-right mt-1">
            <NuxtLink
              to="/auth/forgot-password"
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
      </VForm>

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
const error = ref("");
const loading = ref(false);

// Function to handle user login
const handleLogin = async (values) => {
  try {
    loading.value = true; // Indicate that the login process is ongoing
    error.value = ""; // Clear previous errors

    // Send login credentials to the backend
    const response = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: values.email,
        password: values.password,
      },
      credentials: "include",
    });

    // On successful login, redirect to discover (cookie is set automatically)
    if (response && response.user) {
      await navigateTo("/discover");
    } else {
      error.value = "Invalid email or password. Please try again.";
    }
  } catch (err) {
    // Check if the error is due to invalid credentials
    if (err.data?.message === "Invalid credentials") {
      error.value = "Invalid email or password. Please try again.";
    } else {
      error.value = "An error occurred during login. Please try again.";
    }
  } finally {
    loading.value = false; // End loading state
  }
};
</script>

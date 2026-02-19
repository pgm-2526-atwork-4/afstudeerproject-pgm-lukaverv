<template>
  <div
    class="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <!-- Logo and Branding -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-2">
        <div
          class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
        >
          <svg
            class="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
            />
          </svg>
        </div>
        <h1 class="text-4xl font-bold">
          <span class="text-white">Beat</span
          ><span class="text-blue-500">Stack</span>
        </h1>
      </div>
      <p class="text-gray-400 text-sm">Your music creation hub</p>
    </div>

    <!-- Login Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl"
    >
      <h2 class="text-3xl font-bold text-white mb-2">Welcome back</h2>
      <p class="text-gray-400 text-sm mb-6">
        Sign in to continue to your account
      </p>

      <VForm class="space-y-4" @submit="handleLogin">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-2"
            >Email Address</label
          >
          <VField
            id="email"
            name="email"
            type="email"
            as="input"
            placeholder="e.g username@gmail.com"
            class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rules="required|email"
            autocomplete="email"
          />
          <VErrorMessage name="email" class="text-red-400 text-sm mt-1" />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-300 mb-2"
            >Password</label
          >
          <div class="relative">
            <VField
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              as="input"
              placeholder="Enter your password"
              class="w-full px-4 py-3 pr-12 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rules="required|min:8"
              autocomplete="current-password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
            >
              <svg
                v-if="!showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <VErrorMessage name="password" class="text-red-400 text-sm mt-1" />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-4 h-4 rounded border-gray-600 bg-[#0d1230] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span class="text-sm text-gray-400">Remember me</span>
          </label>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-blue-500 hover:text-blue-400 transition"
            >Forgot password?</NuxtLink
          >
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
          :disabled="loading"
        >
          <span v-if="loading">Signing In...</span>
          <span v-else>Sign In</span>
        </button>
      </VForm>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-[#161b33] text-gray-500">or continue with</span>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white hover:bg-[#1a1f3a] transition"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white hover:bg-[#1a1f3a] transition"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center mt-6 text-sm text-gray-400">
        Don't have an account?
        <NuxtLink
          to="/auth/register"
          class="text-blue-500 hover:text-blue-400 transition font-medium"
          >Sign up for free</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state management
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

// Function to handle user login
const handleLogin = async (values) => {
  try {
    loading.value = true;
    error.value = "";

    const response = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: values.email,
        password: values.password,
      },
      credentials: "include",
    });

    if (response && response.user) {
      await navigateTo("/discover");
    } else {
      error.value = "Invalid email or password. Please try again.";
    }
  } catch (err) {
    if (err.data?.message === "Invalid credentials") {
      error.value = "Invalid email or password. Please try again.";
    } else {
      error.value = "An error occurred during login. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

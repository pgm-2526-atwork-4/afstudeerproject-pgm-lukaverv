<template>
  <div
    class="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <AuthLogo />

    <!-- Login Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl"
    >
      <h2 class="text-3xl font-bold text-white mb-2">Welcome back</h2>
      <p class="text-gray-400 text-sm mb-6">
        Sign in to continue to your account
      </p>

      <VForm class="space-y-4" @submit="handleLogin">
        <AuthEmailInput />

        <AuthPasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          rules="required|min:8"
          autocomplete="current-password"
        />

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

      <AuthSocialLoginButtons @oauth="handleOAuth" />

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
const rememberMe = ref(false);

const { signIn } = useAuth();

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
    if (
      err.statusCode === 403 ||
      err.data?.message?.includes("verify your email")
    ) {
      // User is not verified, redirect to verification pending page
      await navigateTo(
        `/auth/verification-pending?email=${encodeURIComponent(values.email)}`,
      );
    } else if (err.data?.message === "Invalid credentials") {
      error.value = "Invalid email or password. Please try again.";
    } else {
      error.value = "An error occurred during login. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

// Function to handle OAuth login
const handleOAuth = async (provider) => {
  try {
    await signIn(provider, { callbackUrl: "/discover" });
  } catch (err) {
    console.error("OAuth login error:", err);
    error.value = `Failed to sign in with ${provider}. Please try again.`;
  }
};
</script>

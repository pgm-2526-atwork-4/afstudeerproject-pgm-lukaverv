<template>
  <div
    class="register-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <Logo />

    <!-- Register Card -->
    <div
      class="w-full max-w-md p-8 bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl"
    >
      <h2 class="text-3xl font-bold text-white mb-2">Create Account</h2>
      <p class="text-gray-400 text-sm mb-6">Sign up to continue</p>

      <VForm class="space-y-4" @submit="handleRegister">
        <EmailInput rules="required|email|max:255" />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          rules="required|min:8|max:128"
          autocomplete="new-password"
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          rules="required|confirmed:@password"
          autocomplete="new-password"
        />

        <div>
          <label class="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="agreeToTerms"
              class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-[#0d1230] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span class="text-sm text-gray-400">
              I agree to the
              <a
                @click.prevent="showTermsModal = true"
                href="#"
                class="text-blue-500 hover:text-blue-400 transition"
                >Terms of Service</a
              >
              and
              <a
                @click.prevent="showPrivacyModal = true"
                href="#"
                class="text-blue-500 hover:text-blue-400 transition"
                >Privacy Policy</a
              >
            </span>
          </label>
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-400 text-sm">{{ success }}</p>

        <button
          type="submit"
          class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
          :disabled="loading"
        >
          <span v-if="loading">Signing Up...</span>
          <span v-else>Sign Up</span>
        </button>
      </VForm>

      <SocialLoginButtons @oauth="handleOAuth" />

      <!-- Sign In Link -->
      <div class="text-center mt-6 text-sm text-gray-400">
        Already have an account?
        <NuxtLink
          to="/auth/login"
          class="text-blue-500 hover:text-blue-400 transition font-medium"
          >Sign in</NuxtLink
        >
      </div>
    </div>
  </div>

  <TermsModal v-model="showTermsModal" />
  <PrivacyModal v-model="showPrivacyModal" />
</template>

<script setup>
// Reactive variables for state management
const error = ref("");
const success = ref("");
const loading = ref(false);
const agreeToTerms = ref(false);
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);

const { signIn } = useAuth();

// Function to handle user registration
const handleRegister = async (values) => {
  if (!agreeToTerms.value) {
    error.value =
      "Please agree to the Terms of Service and Privacy Policy before continuing.";
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    await $fetch("/api/auth/register", {
      method: "POST",
      body: { email: values.email, password: values.password },
    });

    success.value = "Account created successfully! Please verify your email.";
    await navigateTo(
      `/auth/verification-pending?email=${encodeURIComponent(values.email)}`,
    );
  } catch (err) {
    error.value =
      err.data?.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Function to handle OAuth registration
const handleOAuth = async (provider) => {
  try {
    await signIn(provider, { callbackUrl: "/discover" });
  } catch (err) {
    console.error("OAuth registration error:", err);
    error.value = `Failed to sign up with ${provider}. Please try again.`;
  }
};
</script>

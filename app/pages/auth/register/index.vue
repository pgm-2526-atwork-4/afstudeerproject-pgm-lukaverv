<template>
  <div
    class="register-page flex flex-col items-center justify-center min-h-screen"
  >
    <div class="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-2">Sign Up</h1>
      <p class="text-center text-sm text-gray-600 mb-6">Sign up to continue</p>

      <form class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 text-left"
            >Email</label
          >
          <input
            id="email"
            type="email"
            placeholder="e.g username@gmail.com"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 text-left"
            >Password</label
          >
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button
          type="button"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Sign Up
        </button>
      </form>

      <div class="text-center mt-4 text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline"
          >Sign in</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

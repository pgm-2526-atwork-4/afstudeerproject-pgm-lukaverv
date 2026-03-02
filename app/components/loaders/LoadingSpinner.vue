<template>
  <div
    class="min-h-screen pt-16 bg-gradient-to-b from-[#0f1219] to-[#0a0d14] flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-400">{{ message || "Loading..." }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>

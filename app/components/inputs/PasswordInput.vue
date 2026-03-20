<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
    </label>
    <div class="relative">
      <VField
        :id="name"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        as="input"
        :placeholder="placeholder"
        class="w-full px-4 py-3 pr-12 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        :rules="rules"
        :autocomplete="autocomplete"
      />
      <button
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
      >
        <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" size="20" />
      </button>
    </div>
    <VErrorMessage :name="name" class="text-red-400 text-sm mt-1" />
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Enter your password",
  },
  rules: {
    type: String,
    default: "required|min:8",
  },
  autocomplete: {
    type: String,
    default: "current-password",
  },
});

const showPassword = ref(false);
</script>

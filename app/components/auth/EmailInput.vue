<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
    </label>
    <VField
      :id="name"
      :name="name"
      type="email"
      as="input"
      :placeholder="placeholder"
      class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      :rules="rules"
      :autocomplete="autocomplete"
    />
    <VErrorMessage :name="name" class="text-red-400 text-sm mt-1" />
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: "email",
  },
  label: {
    type: String,
    default: "Email Address",
  },
  placeholder: {
    type: String,
    default: "e.g username@gmail.com",
  },
  rules: {
    type: String,
    default: "required|email",
  },
  autocomplete: {
    type: String,
    default: "email",
  },
});
</script>

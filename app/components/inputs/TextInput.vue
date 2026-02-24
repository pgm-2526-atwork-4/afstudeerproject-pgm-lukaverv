<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
    </label>
    <VField
      :id="name"
      :name="name"
      :type="type"
      as="input"
      :placeholder="placeholder"
      class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      :class="customClass"
      :rules="rules"
      :autocomplete="autocomplete"
      :value="modelValue"
    />
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
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  rules: {
    type: String,
    default: "",
  },
  autocomplete: {
    type: String,
    default: "off",
  },
  customClass: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
});
</script>

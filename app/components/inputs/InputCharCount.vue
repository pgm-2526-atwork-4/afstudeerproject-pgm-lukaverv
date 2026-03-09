<template>
  <div class="relative">
    <slot />
    <span
      class="absolute right-3 text-xs pointer-events-none mb-2"
      :class="[
        position === 'bottom' ? 'bottom-2' : 'top-1/2 -translate-y-1/2',
        current >= max ? 'text-red-400' : 'text-gray-500',
      ]"
    >{{ current }}/{{ max }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ current: number; max: number; position?: 'center' | 'bottom' }>(), {
  position: 'center',
});
</script>

<template>
  <div>
    <!-- Hide Navbar on auth pages and profile creation -->
    <Navbar
      v-if="!route.path.startsWith('/auth') && route.path !== '/profile/create'"
    />

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

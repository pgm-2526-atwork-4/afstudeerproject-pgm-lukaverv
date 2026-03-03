<template>
  <div class="min-h-screen bg-[#0f1219]">
    <!-- Hide Navbar on auth pages and profile creation -->
    <Navbar
      v-if="!route.path.startsWith('/auth') && route.path !== '/profile/create'"
    />

    <main :class="audioStore.currentTrack ? 'pb-24' : ''">
      <slot />
    </main>

    <!-- Audio Player -->
    <AudioPlayer />
  </div>
</template>

<script setup>
const route = useRoute();
const audioStore = useAudioStore();
</script>

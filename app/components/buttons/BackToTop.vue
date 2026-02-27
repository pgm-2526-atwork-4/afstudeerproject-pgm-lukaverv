<template>
  <Transition name="fade-up">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-colors"
    >
      <Icon name="ph:arrow-up-bold" size="18" />
    </button>
  </Transition>
</template>

<script setup>
const { scrollToTop } = useScrollBehavior();

const showButton = ref(false);

const handleScroll = () => {
  showButton.value = window.scrollY > 600;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>

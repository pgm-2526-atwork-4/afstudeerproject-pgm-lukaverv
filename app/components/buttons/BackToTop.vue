<template>
  <Transition name="fade-up">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed right-8 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all duration-200"
      :class="audioStore.currentTrack ? 'bottom-32' : 'bottom-8'"
    >
      <Icon name="ph:arrow-up-bold" size="18" />
    </button>
  </Transition>
</template>

<script setup>
import { useAudioStore } from "@/stores/audio";

const { scrollToTop } = useScrollBehavior();
const audioStore = useAudioStore();

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

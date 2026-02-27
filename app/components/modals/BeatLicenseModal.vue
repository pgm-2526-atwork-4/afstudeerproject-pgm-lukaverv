<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          class="relative bg-[#161b33] rounded-2xl shadow-2xl border border-gray-700/50 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
          >
            <Icon name="ph:x" size="28" />
          </button>

          <!-- Modal Content -->
          <div class="p-8 md:p-10">
            <!-- Beat Info Header -->
            <div class="flex items-center gap-6 mb-10">
              <img
                :src="beat.coverImage"
                :alt="beat.title"
                class="w-28 h-28 md:w-32 md:h-32 rounded-lg object-cover"
              />
              <div>
                <NuxtLink
                  :to="`/beat/${beat.id}`"
                  @click.stop
                  class="block w-fit"
                >
                  <h2
                    class="text-3xl md:text-4xl font-bold text-white hover:text-blue-400 mb-2 transition-colors"
                  >
                    {{ beat.title }}
                  </h2>
                </NuxtLink>
                <p class="text-lg text-gray-400">
                  by
                  <NuxtLink
                    :to="`/producer/${beat.producerId}`"
                    @click.stop
                    class="hover:text-blue-400 transition-colors"
                  >
                    {{ beat.producer }}
                  </NuxtLink>
                </p>
              </div>
            </div>

            <!-- License Options -->
            <div class="grid md:grid-cols-3 gap-6 mb-10">
              <!-- Basic License -->
              <button
                @click="selectedLicense = 'basic'"
                :class="
                  selectedLicense === 'basic'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-7 rounded-xl border-2 transition-all text-left"
              >
                <div
                  v-if="selectedLicense === 'basic'"
                  class="absolute top-4 right-4"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <div class="text-center mb-5">
                  <h3 class="text-xl font-bold text-white mb-2">
                    Basic License
                  </h3>
                  <p class="text-sm text-gray-400 mb-4">(TAGGED MP3)</p>
                  <div class="inline-block bg-gray-800/50 px-8 py-4 rounded-lg">
                    <span class="text-3xl font-bold text-white"
                      >${{ beat.priceBasic.toFixed(2) }}</span
                    >
                  </div>
                </div>
                <p class="text-sm text-gray-400 text-center">MP3</p>
              </button>

              <!-- Premium License -->
              <button
                @click="selectedLicense = 'premium'"
                :class="
                  selectedLicense === 'premium'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-7 rounded-xl border-2 transition-all text-left"
              >
                <div
                  v-if="selectedLicense === 'premium'"
                  class="absolute top-4 right-4"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <div class="text-center mb-5">
                  <h3 class="text-xl font-bold text-white mb-2">
                    Premium License
                  </h3>
                  <p class="text-sm text-gray-400 mb-4">(UNTAGGED WAV + MP3)</p>
                  <div class="inline-block bg-gray-800/50 px-8 py-4 rounded-lg">
                    <span class="text-3xl font-bold text-white"
                      >${{ beat.pricePremium.toFixed(2) }}</span
                    >
                  </div>
                </div>
                <p class="text-sm text-gray-400 text-center">WAV, MP3</p>
              </button>

              <!-- Exclusive License -->
              <button
                @click="selectedLicense = 'exclusive'"
                :class="
                  selectedLicense === 'exclusive'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                "
                class="relative p-7 rounded-xl border-2 transition-all text-left"
              >
                <div
                  v-if="selectedLicense === 'exclusive'"
                  class="absolute top-4 right-4"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-blue-500"
                    size="24"
                  />
                </div>
                <div class="text-center mb-5">
                  <h3 class="text-xl font-bold text-white mb-2">
                    Exclusive License
                  </h3>
                  <p class="text-sm text-gray-400 mb-4">(EXCLUSIVE RIGHTS)</p>
                  <div class="inline-block bg-gray-800/50 px-8 py-4 rounded-lg">
                    <span class="text-3xl font-bold text-white"
                      >${{ beat.priceExclusive.toFixed(2) }}</span
                    >
                  </div>
                </div>
                <p class="text-sm text-gray-400 text-center">WAV, MP3</p>
              </button>
            </div>

            <!-- Usage Terms -->
            <div
              class="bg-[#0f1219] rounded-xl p-7 border border-gray-700/50 mb-8"
            >
              <h3 class="text-2xl font-bold text-white mb-6">Usage Terms</h3>

              <div class="grid md:grid-cols-3 gap-8">
                <!-- Streaming -->
                <div class="flex items-start gap-4">
                  <Icon
                    name="ph:play-circle"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="28"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1 text-base">
                      {{ usageTerms.streams }}
                    </p>
                    <p class="text-sm text-gray-400">streams</p>
                  </div>
                </div>

                <!-- Monetization -->
                <div class="flex items-start gap-4">
                  <Icon
                    name="ph:currency-dollar-simple"
                    class="text-blue-400 flex-shrink-0 mt-1"
                    size="28"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1 text-base">
                      {{ usageTerms.monetization }}
                    </p>
                    <p class="text-sm text-gray-400">for streaming platforms</p>
                  </div>
                </div>

                <!-- Exclusivity -->
                <div class="flex items-start gap-4">
                  <Icon
                    :name="
                      usageTerms.exclusive ? 'ph:check-circle' : 'ph:x-circle'
                    "
                    :class="
                      usageTerms.exclusive ? 'text-green-400' : 'text-red-400'
                    "
                    class="flex-shrink-0 mt-1"
                    size="28"
                  />
                  <div>
                    <p class="text-white font-semibold mb-1 text-base">
                      {{ usageTerms.exclusiveText }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ usageTerms.exclusiveSubtext }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-xl transition-colors shadow-lg text-xl"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  beat: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const selectedLicense = ref("basic");

const usageTerms = computed(() => {
  switch (selectedLicense.value) {
    case "basic":
      return {
        streams: "Max 100,000 streams",
        monetization: "Monetization allowed",
        exclusive: false,
        exclusiveText: "Non-Exclusive rights",
        exclusiveSubtext: "Beat remains publicly available",
      };
    case "premium":
      return {
        streams: "Max 500,000 streams",
        monetization: "Monetization allowed",
        exclusive: false,
        exclusiveText: "Non-Exclusive rights",
        exclusiveSubtext: "Beat remains publicly available",
      };
    case "exclusive":
      return {
        streams: "Unlimited streams",
        monetization: "Full monetization",
        exclusive: true,
        exclusiveText: "Exclusive rights",
        exclusiveSubtext: "Beat removed from store",
      };
    default:
      return {
        streams: "",
        monetization: "",
        exclusive: false,
        exclusiveText: "",
        exclusiveSubtext: "",
      };
  }
});

const closeModal = () => {
  emit("close");
};

// Close on Escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape" && props.isOpen) {
      closeModal();
    }
  };
  document.addEventListener("keydown", handleEscape);
  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>

<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Loading -->
    <div
      v-if="pending"
      class="flex items-center justify-center min-h-[calc(100vh-4rem)]"
    >
      <div class="text-center">
        <Icon
          name="svg-spinners:ring-resize"
          class="w-12 h-12 text-blue-500 mx-auto mb-4"
        />
        <p class="text-gray-400">Verifying your payment...</p>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-[calc(100vh-4rem)]"
    >
      <div class="text-center max-w-md mx-auto px-4">
        <Icon
          name="ph:warning-circle"
          class="w-16 h-16 text-red-400 mx-auto mb-4"
        />
        <h2 class="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p class="text-gray-400 mb-6">
          We couldn't verify your payment. Please contact support if you were
          charged.
        </p>
        <NuxtLink
          to="/discover"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          Back to Discover
        </NuxtLink>
      </div>
    </div>

    <!-- Success -->
    <template v-else-if="order">
      <!-- Hero Header -->
      <div
        class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
      >
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            class="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Icon
              name="ph:check-circle-fill"
              class="text-green-400 w-12 h-12"
            />
          </div>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
          >
            ORDER CONFIRMED
          </h1>
          <p class="text-lg md:text-xl text-gray-300">
            Your purchase is complete. Your beats are ready to download.
          </p>
        </div>
      </div>

      <!-- Content -->
      <div
        class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6"
      >
        <!-- Order Details -->
        <div
          class="bg-[#1a1f35] rounded-xl border border-gray-700/40 overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-gray-700/40 flex items-center justify-between"
          >
            <h2 class="text-base font-semibold text-white">Order Details</h2>
            <span class="text-sm text-gray-400">{{ order.orderId }}</span>
          </div>

          <div class="divide-y divide-gray-700/40">
            <div
              v-for="item in order.items"
              :key="item.beatId"
              class="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/20 transition-colors"
            >
              <img
                :src="item.coverImage"
                :alt="item.title"
                class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-white font-semibold truncate">
                  {{ item.title }}
                </p>
                <p class="text-gray-400 text-sm">{{ item.producer }}</p>
                <span
                  class="text-xs font-medium"
                  :class="{
                    'text-gray-400': item.licenseType === 'BASIC',
                    'text-blue-400': item.licenseType === 'PREMIUM',
                    'text-purple-400': item.licenseType === 'EXCLUSIVE',
                  }"
                >
                  {{ item.licenseType }} License
                </span>
              </div>
              <span class="text-white font-bold flex-shrink-0">
                ${{ item.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-gray-700/40 flex items-center justify-between"
          >
            <span class="text-white font-semibold">Total</span>
            <span class="text-xl font-bold text-white"
              >${{ order.totalAmount.toFixed(2) }}</span
            >
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink
            to="/downloads"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="ph:download-simple" size="20" />
            Go to Downloads
          </NuxtLink>
          <NuxtLink
            to="/discover"
            class="flex-1 bg-[#1a1f35] hover:bg-[#222843] border border-gray-700/40 hover:border-gray-600/60 text-white text-center font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="ph:music-notes" size="20" />
            Continue Browsing
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Order Confirmed",
});

usePageTitle(() => "Order Confirmed");

const route = useRoute();
const cartStore = useCartStore();

const {
  data: order,
  pending,
  error,
} = await useFetch("/api/checkout/verify", {
  query: { session_id: route.query.session_id },
});

watch(
  order,
  (val) => {
    if (val) {
      cartStore.clearCart();
    }
  },
  { immediate: true },
);
</script>

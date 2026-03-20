<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Hero Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <div>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
          >
            CHECKOUT
          </h1>
          <p class="text-lg md:text-xl text-gray-300">
            Review your order and complete your purchase
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Empty Cart -->
      <div v-if="cartStore.isEmpty" class="text-center py-20">
        <Icon
          name="ph:shopping-cart"
          class="w-20 h-20 mx-auto mb-4 text-gray-600"
        />
        <h2 class="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p class="text-gray-400 mb-6">Add some beats before checking out</p>
        <NuxtLink
          to="/discover"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          Discover Beats
        </NuxtLink>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid lg:grid-cols-[1fr_340px] gap-6">
        <!-- Left: Order Items -->
        <div
          class="bg-[#1e2441] border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
          >
            <h2 class="text-sm font-semibold text-white">Order Summary</h2>
            <span class="text-xs text-gray-400">
              {{ cartStore.itemCount }}
              {{ cartStore.itemCount === 1 ? "item" : "items" }}
            </span>
          </div>

          <!-- Items -->
          <div class="divide-y divide-gray-700/50">
            <div
              v-for="item in cartStore.items"
              :key="item.beatId"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/30 transition-colors"
            >
              <img
                :src="item.coverImage"
                :alt="item.title"
                class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">
                  {{ item.title }}
                </p>
                <p class="text-xs text-gray-400">{{ item.producer }}</p>
                <span
                  class="text-xs font-medium"
                  :class="{
                    'text-gray-400': item.licenseType === 'basic',
                    'text-blue-400': item.licenseType === 'premium',
                    'text-purple-400': item.licenseType === 'exclusive',
                  }"
                >
                  {{
                    item.licenseType.charAt(0).toUpperCase() +
                    item.licenseType.slice(1)
                  }}
                  License
                </span>
              </div>
              <span class="text-sm font-bold text-white flex-shrink-0">
                ${{ item.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Edit Cart Link -->
          <div class="border-t border-gray-700">
            <NuxtLink
              to="/shop/cart"
              class="block px-4 py-3 text-center text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
            >
              Edit Cart
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Payment Summary -->
        <div
          class="bg-[#1e2441] border border-gray-700 rounded-xl shadow-2xl overflow-hidden lg:sticky lg:top-24 self-start"
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-700">
            <h2 class="text-sm font-semibold text-white">Payment Summary</h2>
          </div>

          <!-- Totals -->
          <div class="px-4 py-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Subtotal</span>
              <span class="text-white"
                >${{ cartStore.totalPrice.toFixed(2) }}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Tax</span>
              <span class="text-white">$0.00</span>
            </div>
            <div
              class="border-t border-gray-700 pt-3 flex justify-between items-center"
            >
              <span class="text-sm font-semibold text-white">Total</span>
              <span class="text-xl font-bold text-white"
                >${{ cartStore.totalPrice.toFixed(2) }}</span
              >
            </div>
          </div>

          <!-- Pay Button -->
          <div class="px-4 pb-4">
            <button
              @click="handleCheckout"
              :disabled="processing"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Icon
                v-if="processing"
                name="svg-spinners:ring-resize"
                size="18"
              />
              <Icon v-else name="ph:lock-simple" size="18" />
              {{ processing ? "Processing..." : "Pay with Stripe" }}
            </button>

            <p v-if="errorMsg" class="text-red-400 text-xs mt-3 text-center">
              {{ errorMsg }}
            </p>
          </div>

          <!-- Security Note -->
          <div
            class="border-t border-gray-700 px-4 py-3 flex items-center justify-center gap-2"
          >
            <Icon name="ph:shield-check" class="text-green-400" size="14" />
            <span class="text-xs text-gray-400">Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Checkout",
});

usePageTitle(() => "Checkout");

const cartStore = useCartStore();
const processing = ref(false);
const errorMsg = ref("");

onMounted(() => {
  cartStore.loadFromStorage();
});

const handleCheckout = async () => {
  processing.value = true;
  errorMsg.value = "";

  try {
    const { url } = await $fetch("/api/checkout/create-session", {
      method: "POST",
      body: {
        items: cartStore.items.map((item) => ({
          beatId: item.beatId,
          licenseType: item.licenseType,
        })),
      },
    });

    if (url) {
      window.location.href = url;
    }
  } catch (err: any) {
    errorMsg.value =
      err?.data?.message || "Something went wrong. Please try again.";
  } finally {
    processing.value = false;
  }
};
</script>

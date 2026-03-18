<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Hero Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
            >
              SHOPPING CART
            </h1>
            <p class="text-lg md:text-xl text-gray-300">
              {{
                cartStore.isEmpty
                  ? "Your cart is empty"
                  : `${cartStore.itemCount} ${cartStore.itemCount === 1 ? "item" : "items"} · $${cartStore.totalPrice.toFixed(2)}`
              }}
            </p>
          </div>
          <button
            v-if="!cartStore.isEmpty"
            @click="cartStore.clearCart()"
            class="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-lg transition-colors bg-red-500/5 hover:bg-red-500/10 font-medium"
          >
            <Icon name="ph:trash" size="16" />
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Empty State -->
      <div v-if="cartStore.isEmpty" class="text-center py-20">
        <Icon
          name="ph:shopping-cart"
          class="w-20 h-20 mx-auto mb-4 text-gray-600"
        />
        <h2 class="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p class="text-gray-400 mb-6">
          Browse beats and add licenses to your cart
        </p>
        <NuxtLink
          to="/discover"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Icon name="ph:music-notes" size="20" />
          Discover Beats
        </NuxtLink>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-4">
        <!-- Mobile Clear All -->
        <div class="flex justify-end md:hidden">
          <button
            @click="cartStore.clearCart()"
            class="text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>

        <div
          v-for="item in cartStore.items"
          :key="item.beatId"
          class="bg-[#1a1f35] rounded-xl border border-gray-700/40 p-4 sm:p-6 flex items-center gap-4 sm:gap-6 hover:border-gray-600/60 transition-colors"
        >
          <NuxtLink :to="`/beat/${item.beatId}`" class="flex-shrink-0">
            <img
              :src="item.coverImage"
              :alt="item.title"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            />
          </NuxtLink>

          <div class="flex-1 min-w-0">
            <NuxtLink
              :to="`/beat/${item.beatId}`"
              class="text-white font-bold text-base sm:text-lg hover:text-blue-400 transition-colors truncate block"
            >
              {{ item.title }}
            </NuxtLink>
            <p class="text-gray-400 text-sm">{{ item.producer }}</p>
            <span
              class="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full"
              :class="{
                'bg-gray-700/50 text-gray-300': item.licenseType === 'basic',
                'bg-blue-600/20 text-blue-400': item.licenseType === 'premium',
                'bg-purple-600/20 text-purple-400':
                  item.licenseType === 'exclusive',
              }"
            >
              {{
                item.licenseType.charAt(0).toUpperCase() +
                item.licenseType.slice(1)
              }}
              License
            </span>
          </div>

          <div class="flex items-center gap-4 flex-shrink-0">
            <span class="text-lg sm:text-xl font-bold text-white">
              ${{ item.price.toFixed(2) }}
            </span>
            <button
              @click="cartStore.removeItem(item.beatId)"
              class="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              <Icon name="ph:trash" size="20" />
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-[#1a1f35] rounded-xl border border-gray-700/40 p-6 mt-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400 text-sm"
              >{{ cartStore.itemCount }}
              {{ cartStore.itemCount === 1 ? "item" : "items" }}</span
            >
            <span class="text-gray-400 text-sm">Subtotal</span>
          </div>
          <div class="flex items-center justify-between mb-6">
            <span class="text-xl font-bold text-white">Total</span>
            <span class="text-2xl font-bold text-white"
              >${{ cartStore.totalPrice.toFixed(2) }}</span
            >
          </div>
          <NuxtLink
            to="/shop/checkout"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Proceed to Checkout
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Cart",
});

usePageTitle(() => "Cart");

const cartStore = useCartStore();

onMounted(() => {
  cartStore.loadFromStorage();
});
</script>

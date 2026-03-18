<template>
  <div class="relative" ref="dropdownRef">
    <!-- Cart Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
      aria-label="Shopping Cart"
    >
      <Icon
        name="material-symbols-light:shopping-bag-outline"
        class="w-8 h-8"
      />
      <!-- Item Count Badge -->
      <span
        v-if="cartStore.itemCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
      >
        {{ cartStore.itemCount > 99 ? "99+" : cartStore.itemCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1e2441] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
        >
          <h3 class="text-sm font-semibold text-white">Shopping Cart</h3>
          <button
            v-if="cartStore.itemCount > 0"
            @click="cartStore.clearCart()"
            class="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>

        <!-- Cart Items -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Empty State -->
          <div v-if="cartStore.isEmpty" class="p-8 text-center text-gray-400">
            <Icon
              name="ph:shopping-cart"
              class="w-10 h-10 mx-auto mb-2 opacity-50"
            />
            <p class="text-sm">Your cart is empty</p>
          </div>

          <!-- Items -->
          <div v-else>
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
                <p class="text-xs text-blue-400 font-medium">
                  {{
                    item.licenseType.charAt(0).toUpperCase() +
                    item.licenseType.slice(1)
                  }}
                  License
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-sm font-bold text-white"
                  >${{ item.price.toFixed(2) }}</span
                >
                <button
                  @click.stop="cartStore.removeItem(item.beatId)"
                  class="p-1 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Icon name="ph:x" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cartStore.isEmpty" class="border-t border-gray-700">
          <!-- Total -->
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-sm font-semibold text-gray-300">Total</span>
            <span class="text-lg font-bold text-white"
              >${{ cartStore.totalPrice.toFixed(2) }}</span
            >
          </div>
          <!-- Checkout Button -->
          <div class="px-4 pb-3">
            <NuxtLink
              to="/shop/checkout"
              @click="closeDropdown"
              class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Proceed to Checkout
            </NuxtLink>
          </div>
        </div>

        <!-- View Cart Link -->
        <div class="px-4 pb-3">
          <NuxtLink
            to="/shop/cart"
            @click="closeDropdown"
            class="block w-full bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-white text-center font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            View Cart
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const cartStore = useCartStore();
const isOpen = ref(false);
const dropdownRef = ref(null);

onMounted(() => {
  cartStore.loadFromStorage();
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

onMounted(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      closeDropdown();
    }
  };
  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

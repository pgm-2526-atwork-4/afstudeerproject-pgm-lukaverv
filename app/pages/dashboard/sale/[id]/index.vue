<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Hero Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <h1
          class="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
        >
          SALE DETAILS
        </h1>
        <p class="text-gray-400 text-lg">License transaction information</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Loading -->
      <div v-if="pending" class="space-y-4 animate-pulse">
        <div class="h-32 bg-dark-800 rounded-xl"></div>
        <div class="h-48 bg-dark-800 rounded-xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <Icon
          name="ph:warning-circle"
          class="w-16 h-16 mx-auto mb-4 text-red-400"
        />
        <h2 class="text-xl font-bold text-white mb-2">Sale not found</h2>
        <NuxtLink
          to="/dashboard"
          class="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to Dashboard
        </NuxtLink>
      </div>

      <!-- Sale Details -->
      <div
        v-else-if="sale"
        class="bg-dark-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <!-- Order Summary Section -->
        <div class="p-6 md:p-8 border-b border-gray-700/50">
          <h2 class="text-lg font-bold text-white mb-6">Order Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Date
              </p>
              <p class="text-white font-medium">
                {{ formatDate(sale.createdAt) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Invoice
              </p>
              <p class="text-white font-mono text-sm">{{ sale.orderId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Status
              </p>
              <span
                class="inline-flex items-center gap-1 text-green-400 font-semibold"
              >
                <Icon name="ph:check-circle-fill" size="16" />
                {{ sale.orderStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- Transaction Details Section -->
        <div class="p-6 md:p-8 border-b border-gray-700/50">
          <h2 class="text-lg font-bold text-white mb-4">Transaction Details</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4 p-4 bg-dark-700/30 rounded-lg">
              <img
                :src="sale.beatCover"
                :alt="sale.beatTitle"
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-white font-semibold truncate">
                  {{ sale.beatTitle }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ sale.licenseType }} License (MP3 and WAV)
                </p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-white font-bold">${{ sale.price.toFixed(2) }}</p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-700/30">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Subtotal</span>
                <span class="text-white font-medium"
                  >${{ sale.price.toFixed(2) }}</span
                >
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-400">Discount</span>
                <span class="text-white font-medium">$0.00</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-400">Service Fee</span>
                <span class="text-white font-medium">$0.00</span>
              </div>
              <div
                class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/30"
              >
                <span class="text-lg font-bold text-white">Total</span>
                <span class="text-lg font-bold text-green-400"
                  >${{ sale.price.toFixed(2) }}</span
                >
              </div>
            </div>

            <div
              v-if="sale.stripePaymentId"
              class="pt-3 border-t border-gray-700/30"
            >
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Payment ID</span>
                <span class="text-white font-mono truncate max-w-[250px] ml-4">
                  {{ sale.stripePaymentId }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer & Seller Information -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700/50"
        >
          <!-- Customer Information -->
          <div class="p-6 md:p-8">
            <h2 class="text-lg font-bold text-white mb-4">
              Customer Information
            </h2>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Name
                </p>
                <p class="text-white font-medium">
                  {{ sale.buyer.firstName }} {{ sale.buyer.lastName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p class="text-white font-medium">{{ sale.buyer.email }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Username
                </p>
                <NuxtLink
                  :to="`/profile/${sale.buyer.userId}`"
                  class="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  @{{ sale.buyer.username }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Seller Information -->
          <div class="p-6 md:p-8">
            <h2 class="text-lg font-bold text-white mb-4">Seller</h2>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Name
                </p>
                <p class="text-white font-medium">
                  {{ sale.producer.firstName }} {{ sale.producer.lastName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p class="text-white font-medium">{{ sale.producer.email }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Username
                </p>
                <NuxtLink
                  :to="`/profile/${sale.producer.userId}`"
                  class="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  @{{ sale.producer.username }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <div class="p-6 md:p-8 border-t border-gray-700/50">
          <button
            @click="navigateTo('/dashboard?tab=sales')"
            class="w-full md:w-auto px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Icon name="ph:arrow-left" size="18" />
            Back to Sales
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Sale Details",
  middleware: "producer-only",
});

const route = useRoute();
const { formatDate } = useFormatters();

const {
  data: sale,
  pending,
  error,
} = await useFetch(`/api/dashboard/sales/${route.params.id}`, {
  headers: useRequestHeaders(["cookie"]),
});

usePageTitle(
  () =>
    sale.value ? `Sale – ${(sale.value as any).beatTitle}` : "Sale Details",
  "Dashboard",
);
</script>

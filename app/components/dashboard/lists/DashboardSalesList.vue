<template>
  <div class="bg-dark-800 rounded-xl shadow-2xl">
    <!-- Header -->
    <div class="p-4 sm:p-6 md:p-8 border-b border-dark-700/50">
      <DashboardFilterBar
        title="Sales History"
        :subtitle="`${total ?? sales?.length ?? 0} total sales`"
        :sort="sort"
        @update:sort="$emit('update:sort', $event)"
        v-model:search="searchQuery"
        :sort-options="[
          { value: 'newest', label: 'Most Recent' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'highest', label: 'Highest Price' },
          { value: 'lowest', label: 'Lowest Price' },
        ]"
        search-placeholder="Search sales..."
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
      ></div>
      <p class="text-gray-400 mt-4">Loading sales...</p>
    </div>

    <!-- Sales List -->
    <div
      v-else-if="sales && sales.length > 0"
      class="divide-y divide-gray-700/30"
    >
      <NuxtLink
        v-for="sale in filteredSales"
        :key="sale.id"
        :to="`/dashboard/sale/${sale.id}`"
        class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-dark-750 transition-colors group block"
      >
        <img
          :src="sale.beatCover"
          :alt="sale.beatTitle"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0 bg-dark-700"
        />
        <div class="flex-1 min-w-0">
          <h3
            class="text-sm sm:text-base text-white font-medium truncate group-hover:text-primary-400 transition-colors"
          >
            {{ sale.beatTitle }}
          </h3>
          <div class="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
            <span class="text-xs sm:text-sm text-gray-400"
              >@{{ sale.buyer.username }}</span
            >
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="{
                'bg-gray-700/50 text-gray-300': sale.licenseType === 'BASIC',
                'bg-blue-600/20 text-blue-400': sale.licenseType === 'PREMIUM',
                'bg-purple-600/20 text-purple-400':
                  sale.licenseType === 'EXCLUSIVE',
              }"
              >{{ sale.licenseType }}</span
            >
            <span class="text-xs text-gray-500">{{
              formatDate(sale.createdAt)
            }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <span class="text-white font-semibold text-sm sm:text-base"
            >${{ sale.price.toFixed(2) }}</span
          >
          <Icon
            name="ph:caret-right"
            class="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors"
          />
        </div>
      </NuxtLink>

      <!-- Empty Search State -->
      <div
        v-if="filteredSales.length === 0 && searchQuery"
        class="p-12 text-center"
      >
        <Icon
          name="ph:magnifying-glass"
          class="w-16 h-16 mx-auto mb-4 text-gray-600"
        />
        <p class="text-gray-400 mb-2">No sales found</p>
        <p class="text-sm text-gray-500">Try a different search term</p>
      </div>
    </div>

    <!-- Empty State - No Sales -->
    <div v-else class="p-12 text-center">
      <Icon
        name="ph:currency-dollar"
        class="w-16 h-16 mx-auto mb-4 text-gray-600"
      />
      <p class="text-gray-400 mb-2">No sales yet</p>
      <p class="text-sm text-gray-500">
        When someone buys your beats, they'll appear here
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Sale {
  id: string;
  beatTitle: string;
  beatCover: string;
  licenseType: string;
  price: number;
  createdAt: string;
  buyer: { username: string };
}

interface Props {
  sales?: Sale[];
  loading?: boolean;
  total?: number;
  sort?: string;
}

const props = withDefaults(defineProps<Props>(), { sort: "newest" });
defineEmits<{ "update:sort": [value: string] }>();

const searchQuery = ref("");

const filteredSales = computed(() => {
  if (!props.sales) return [];
  if (!searchQuery.value) return props.sales;

  const query = searchQuery.value.toLowerCase();
  return props.sales.filter(
    (sale) =>
      sale.beatTitle.toLowerCase().includes(query) ||
      sale.buyer.username.toLowerCase().includes(query) ||
      sale.licenseType.toLowerCase().includes(query),
  );
});

const { formatDate } = useFormatters();
</script>

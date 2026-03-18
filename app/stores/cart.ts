export interface CartItem {
  beatId: string;
  title: string;
  producer: string;
  producerId: string;
  coverImage: string;
  licenseType: "basic" | "premium" | "exclusive";
  price: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(item: CartItem) {
      // Remove existing entry for same beat (upgrade/change license)
      this.items = this.items.filter((i) => i.beatId !== item.beatId);
      this.items.push(item);
      this.saveToStorage();
    },

    removeItem(beatId: string) {
      this.items = this.items.filter((i) => i.beatId !== beatId);
      this.saveToStorage();
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    hasBeat(beatId: string) {
      return this.items.some((i) => i.beatId === beatId);
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem("beatstack_cart", JSON.stringify(this.items));
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem("beatstack_cart");
        if (saved) {
          try {
            this.items = JSON.parse(saved);
          } catch {
            this.items = [];
          }
        }
      }
    },
  },
});

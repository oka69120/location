import { defineStore } from 'pinia'

export interface ReservedProduct {
  _id: string
  name: string
  price: number
  images: string[]
  quantity: number
}

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    items: [] as ReservedProduct[]
  }),

  getters: {
    totalItems: state => state.items.length,
    totalPrice: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    hasProduct: (state) => (id: string) => state.items.some(p => p._id === id),
  },

  actions: {
    addProduct(product: ReservedProduct) {
      if (!this.hasProduct(product._id)) {
        this.items.push({ ...product, quantity: product.quantity || 1 })
      }
    },

    removeProduct(id: string) {
      this.items = this.items.filter(p => p._id !== id)
    },

    clearReservation() {
      this.items = []
    },

    updateQuantity(id: string, qty: number) {
      const item = this.items.find(p => p._id === id)
      if (item && qty > 0) item.quantity = qty
    }
  },

  persist: true
})

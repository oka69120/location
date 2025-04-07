<template>
  <AdminLayout>
  <div class="admin-orders">
    <h2>Demandes de location</h2>

    <div v-if="orders.length === 0">Aucune demande trouvée.</div>

    <div v-for="order in orders" :key="order._id" class="order-card">
      <h3>{{ order.fullName }} ({{ order.clientType }})</h3>
      <p><strong>Email :</strong> {{ order.email }}</p>
      <p><strong>Téléphone :</strong> {{ order.phone }}</p>
      <p><strong>Adresse :</strong> {{ order.address }}</p>
      <p><strong>Lieu de l'événement :</strong> {{ order.eventLocation }}</p>
      <p><strong>Type d'événement :</strong> {{ order.eventType }}</p>
      <p v-if="order.companyName"><strong>Société :</strong> {{ order.companyName }}</p>
      <p><strong>Dates :</strong> du {{ formatDate(order.startDate) }} au {{ formatDate(order.endDate) }}</p>
      <p><strong>Message :</strong> {{ order.message || '—' }}</p>
      <p><strong>Statut :</strong> {{ order.status }}</p>

      <h4>Produits :</h4>
      <ul>
        <li v-for="(p, i) in order.products" :key="i">
          {{ p.quantity }} × {{ p.name }} ({{ p.price }} €)
        </li>
      </ul>

      <p><strong>Total :</strong> {{ order.totalPrice.toFixed(2) }} €</p>

      <button
        v-if="order.status !== 'traitée'"
        @click="markAsTreated(order._id)"
        class="btn"
      >
        Marquer comme traitée
      </button>

      <hr />
    </div>
  </div>
</AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/layouts/AdminLayout.vue'

interface Product {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  fullName: string
  email: string
  phone: string
  address: string
  eventLocation: string
  eventType: 'mariage' | 'anniversaire' | 'cocktail' | 'autre'
  clientType: 'particulier' | 'société'
  companyName?: string
  startDate: string
  endDate: string
  message?: string
  products: Product[]
  totalPrice: number
  status: 'nouvelle' | 'en cours' | 'traitée'
  createdAt: string
}

const orders = ref<Order[]>([])

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    orders.value = res.data
  } catch (err) {
    console.error('Erreur chargement des demandes :', err)
  }
}

const markAsTreated = async (orderId: string) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put(
      `http://localhost:5000/api/orders/${orderId}/status`,
      { status: 'traitée' },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const index = orders.value.findIndex(o => o._id === orderId)
    if (index !== -1) orders.value[index].status = res.data.status
  } catch (err) {
    console.error('Erreur mise à jour du statut :', err)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.admin-orders {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

.order-card {
  background: #f9f9f9;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn {
  margin-top: 1rem;
  background-color: #55b747;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>

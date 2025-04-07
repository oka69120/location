<template>
  <AdminLayout>
  <div class="admin-products">
    <h1>Produits (Admin)</h1>
    <button class="add-button" @click="openCreateModal">➕ Ajouter un produit</button>

    <div class="filters">
  <input v-model="searchTerm" @input="currentPage = 1; fetchProducts()" placeholder="🔍 Rechercher..." />
  <select v-model="selectedCategory" @change="currentPage = 1; fetchProducts()">
    <option value="">Toutes catégories</option>
    <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
  </select>
</div>



    <div class="product-grid">
      <div v-for="product in products" :key="product._id" class="product-card">
        <img :src="getImage(product.images)" alt="Produit" />
        <h3>{{ product.name }}</h3>
        <p class="price">{{ product.price.toFixed(2) }} €</p>
        <div class="actions">
          <button @click="openEditModal(product)">Modifier</button>
          <button @click="deleteProduct(product._id)">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modale d'ajout/édition -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h2>{{ isCreating ? 'Ajouter un produit' : 'Modifier le produit' }}</h2>
        <form @submit.prevent="submitEdit" enctype="multipart/form-data">
          <label>Nom</label>
          <input v-model="form.name" required />

          <label>Prix (€)</label>
          <input type="number" v-model.number="form.price" required />

          <label>Description</label>
          <textarea v-model="form.description" />

          <label>Stock</label>
          <input type="number" v-model.number="form.stock" required />

          <label>Catégorie</label>
          <select v-model="form.category" required>
            <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
          </select>

          <label>Images actuelles</label>
          <div class="preview">
            <div class="img-box" v-for="img in imagesToKeep" :key="img">
              <img :src="getImage([img])" />
              <button @click.prevent="removeImage(img)">❌</button>
            </div>
          </div>

          <label>Produit mis en avant</label>
<input type="checkbox" v-model="form.isHighlighted" />

<label>Produit phare (page d’accueil)</label>
<input type="checkbox" v-model="form.isFeatured" />

<label>Ajouter de nouvelles images (max 4)</label>
          <input type="file" multiple accept="image/*" @change="handleFileUpload" />

          <label>Nouvelles images sélectionnées</label>
          <div class="preview">
            <div class="img-box" v-for="(file, i) in newImages" :key="i">
              <img :src="URL.createObjectURL(file)" />
              <button @click.prevent="removeNewImage(i)">❌</button>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit">{{ isCreating ? 'Ajouter' : 'Enregistrer' }}</button>
            <button type="button" @click="closeModal">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="pagination">
  <button @click="currentPage--" :disabled="currentPage === 1">← Précédent</button>
  <span>Page {{ currentPage }} / {{ totalPages }}</span>
  <button @click="currentPage++" :disabled="currentPage === totalPages">Suivant →</button>
</div>
</AdminLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { API_URL } from '@/api'

const toast = useToast()

const searchTerm = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10 // Produits par page

const URL = window.URL || window.webkitURL

interface Product {
  _id: string
  name: string
  price: number
  description: string
  stock: number
  category: string
  images: string[]
}

interface Category {
  _id: string
  name: string
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const isModalOpen = ref(false)
const isCreating = ref(false)

const form = ref<any>({
  _id: '',
  name: '',
  price: 0,
  description: '',
  stock: 0,
  category: '',
    isFeatured: false,
    isHighlighted: false,
  images: []
})


const newImages = ref<File[]>([])
const imagesToKeep = ref<string[]>([])

const getImage = (imgs: string[]) =>
  imgs.length ? `${API_URL}/${imgs[0]}` : ''

  const fetchProducts = async () => {
  const params = {
    search: searchTerm.value,
    category: selectedCategory.value,
    page: currentPage.value,
    limit
  }

  const res = await axios.get('${API_URL}/api/products', { params })
  products.value = res.data.products
  totalPages.value = Math.ceil(res.data.total / limit)
}

watch(currentPage, () => {
  fetchProducts()
})

const fetchCategories = async () => {
  const res = await axios.get('${API_URL}/api/categories')
  categories.value = res.data
}

const openCreateModal = () => {
  isCreating.value = true
  form.value = { name: '', price: 0, description: '', stock: 0, category: '',
    isFeatured: false,
    isHighlighted: false, images: [] }
  newImages.value = []
  imagesToKeep.value = []
  isModalOpen.value = true
}


const openEditModal = (product: Product) => {
  isCreating.value = false
  form.value = { ...product }
  imagesToKeep.value = [...product.images]
  newImages.value = []
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isCreating.value = false
  form.value = { name: '', price: 0, description: '', stock: 0, category: '',
    isFeatured: false,
    isHighlighted: false, images: [] }
  newImages.value = []
  imagesToKeep.value = []
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    newImages.value = Array.from(target.files).slice(0, 4)
  }
}

const removeImage = (img: string) => {
  imagesToKeep.value = imagesToKeep.value.filter(i => i !== img)
}

const removeNewImage = (index: number) => {
  newImages.value.splice(index, 1)
}

const submitEdit = async () => {
  try {
    const token = localStorage.getItem('token')
    const fd = new FormData()

    fd.append('name', form.value.name)
    fd.append('price', form.value.price.toString())
    fd.append('description', form.value.description)
    fd.append('stock', form.value.stock.toString())
    fd.append('category', form.value.category)
    fd.append('isFeatured', form.value.isFeatured?.toString() || 'false')
    fd.append('isHighlighted', form.value.isHighlighted?.toString() || 'false')

    imagesToKeep.value.forEach(img => fd.append('imagesToKeep', img))
    newImages.value.forEach(file => fd.append('images', file))

    const url = isCreating.value
      ? '${API_URL}/api/products'
      : `${API_URL}/api/products/${form.value._id}`

    const method = isCreating.value ? 'post' : 'put'

    const res = await axios[method](url, fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

    const updatedProduct = res.data.product || res.data

    if (isCreating.value) {
      products.value.unshift(updatedProduct)
    } else {
      const index = products.value.findIndex(p => p._id === updatedProduct._id)
      if (index !== -1) {
        // ⚡ Forcer la mise à jour en remplaçant l'objet complet
        products.value.splice(index, 1, updatedProduct)
      }
    }

    toast.success(isCreating.value ? 'Produit ajouté' : 'Produit modifié')
    closeModal()
  } catch (err) {
    console.error('Erreur modification produit', err)
    toast.error("Erreur lors de l'enregistrement")
  }
}


const deleteProduct = async (id: string) => {
  const token = localStorage.getItem('token')
  if (!confirm('Confirmer la suppression ?')) return
  await axios.delete(`${API_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  products.value = products.value.filter(p => p._id !== id)
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.admin-products {
  padding: 2rem;
}

.add-button {
  margin-bottom: 1.5rem;
  background-color: #55b747;
  color: white;
  font-weight: bold;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.add-button:hover {
  background-color: #449d39;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  gap: 1.5rem;
  justify-content: center;
}

.product-card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.product-card img {
  max-width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.actions button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.actions button:first-child {
  background-color: #8023f1;
}

.actions button:last-child {
  background-color: #e74c3c;
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90%;
}

.modal-box input,
.modal-box textarea,
.modal-box select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-box label {
  margin-top: 1rem;
  display: block;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0.5rem 0;
}

.preview .img-box {
  position: relative;
}

.preview img {
  max-width: 70px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.preview button {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e74c3c;
  border: none;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  align-items: center;
}

.filters input,
.filters select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #fccc44;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #e6b700;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>

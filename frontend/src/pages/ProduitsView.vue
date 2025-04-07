<template>
  <div class="produits">
    <h1>Nos produits</h1>

    <!-- Filtres de recherche -->
    <div class="filters">
      <input
        v-model="searchTerm"
        @input="fetchProducts"
        placeholder="Rechercher un produit..."
        class="search-input"
      />

      <select v-model="selectedCategory" @change="fetchProducts" class="category-select">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat.name" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
        :onClickImage="() => openGallery(product)"
      />
    </div>

    <!-- Galerie d’image lightbox -->
    <transition name="fade">
      <div class="lightbox-overlay" v-if="showGallery" @click.self="closeGallery">
        <div class="lightbox-content">
          <button class="close-btn" @click="closeGallery">✖</button>
          <button v-if="currentImages.length > 1" class="nav left" @click.stop="prevImage">←</button>
          <transition name="fade-image" mode="out-in">
            <img
              :src="currentImageUrl"
              :key="currentImageUrl"
              class="gallery-image"
            />
          </transition>
          <button v-if="currentImages.length > 1" class="nav right" @click.stop="nextImage">→</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
}

const products = ref<Product[]>([])
const searchTerm = ref('')
const selectedCategory = ref('')
const categories = ref<{ _id: string; name: string }[]>([])

const fetchProducts = async () => {
  const query = new URLSearchParams()
  if (searchTerm.value) query.append('search', searchTerm.value)
  if (selectedCategory.value) query.append('category', selectedCategory.value)

  const res = await axios.get(`http://localhost:5000/api/products?${query.toString()}`)
  products.value = res.data.products
}

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:5000/api/categories')
  categories.value = res.data
}

// Lightbox
const showGallery = ref(false)
const currentImages = ref<string[]>([])
const currentIndex = ref(0)

const currentImageUrl = computed(() =>
  currentImages.value.length ? `http://localhost:5000/${currentImages.value[currentIndex.value]}` : ''
)

const openGallery = (product: Product) => {
  currentImages.value = product.images
  currentIndex.value = 0
  showGallery.value = true
}

const closeGallery = () => {
  showGallery.value = false
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % currentImages.value.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + currentImages.value.length) % currentImages.value.length
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.produits {
  padding: 2rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}
.search-input, .category-select {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 220px;
}
.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

/* Galerie / Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.lightbox-content {
  position: relative;
  max-width: 90vh;
  max-height: 90vh;
}
.gallery-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  transition: transform 0.3s ease;
}
.close-btn {
  position: absolute;
  top: -30px;
  right: -30px;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.nav.left {
  left: -50px;
}
.nav.right {
  right: -50px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-image-enter-active, .fade-image-leave-active {
  transition: all 0.4s ease;
}
.fade-image-enter-from, .fade-image-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
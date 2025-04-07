<template>
    <div class="home">
    <!-- Hero Section -->
    <HeroCarousel />

    <section class="featured-products" v-if="serviceProducts.length">
      <h2>Nos services événementiels</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in serviceProducts"
          :key="product._id"
          :product="product"
          :onClickImage="() => openGallery(product)"
        />
      </div>
    </section>


    <!-- Avantages Section -->
    <section class="benefits">
      <div class="benefit">
        <i class="icon">💼</i>
        <h2>Large choix de matériel</h2>
      </div>
      <div class="benefit">
        <i class="icon">⚡</i>
        <h2>Réponse sous 24h</h2>
      </div>
      <div class="benefit">
        <i class="icon">💰</i>
        <h2>Tarifs compétitifs</h2>
      </div>
    </section>

    <!-- Produits phares -->
    <section class="featured-products" v-if="featuredProducts.length">
      <h2>Nos produits phares</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product._id"
          :product="product"
          :onClickImage="() => openGallery(product)"
        />
      </div>
    </section>

    <!-- Étapes de réservation -->
    <section class="steps-section">
      <h2 class="steps-title">🛠️ Comment ça marche ?</h2>
      <ol class="steps-list">
  <li v-for="(step, i) in steps" :key="i" class="step-item" v-intersect>
    <div class="step-circle">{{ i + 1 }}</div>
    <span>{{ step }}</span>
  </li>
</ol>

    </section>


    <!-- Produits mis en avant -->
    <section class="featured-products" v-if="highlightedProducts.length">
      <h2>Nos produits mis en avant</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in highlightedProducts"
          :key="product._id"
          :product="product"
          :onClickImage="() => openGallery(product)"
        />
      </div>
    </section>


    <!-- Modale Lightbox personnalisée -->
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



    <!-- Contact -->
    <section class="contact">
      <h2>Une question ?</h2>
      <p>Contactez-nous à <a href="mailto:contact@monsite.com">contact@monsite.com</a></p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { API_URL } from '@/api'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import HeroCarousel from '@/components/HeroCarousel.vue'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
}

const featuredProducts = ref<Product[]>([])
const highlightedProducts = ref<Product[]>([])

const fetchFeatured = async () => {
  const res = await axios.get('${API_URL}/api/products?featured=true&limit=4')
  featuredProducts.value = res.data.products
}

const fetchHighlighted = async () => {
  const res = await axios.get('${API_URL}/api/products?highlighted=true&limit=4')
  highlightedProducts.value = res.data.products
}

const serviceProducts = ref<Product[]>([])

const fetchServices = async () => {
  const res = await axios.get('${API_URL}/api/products?category=services&limit=4')
  serviceProducts.value = res.data.products
}

onMounted(() => {
  fetchServices()
})


// 🎯 GESTION GALERIE
const showGallery = ref(false)
const currentImages = ref<string[]>([])
const currentIndex = ref(0)

const currentImageUrl = computed(() =>
  currentImages.value.length ? `${API_URL}/${currentImages.value[currentIndex.value]}` : ''
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

const steps = [
  'Sélectionnez vos produits',
  'Remplissez le formulaire',
  'Nous vous contactons pour finaliser'
]
const vIntersect = {
  mounted(el: HTMLElement) {
    el.classList.add('before-reveal')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('reveal')
        observer.unobserve(el)
      }
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

onMounted(() => {
  fetchFeatured()
  fetchHighlighted()
})
</script>

<style scoped>

.featured-products {
  padding: 2rem;
}

.featured-products h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #7a4ccf;
}


.benefits {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  background: #fff;
  flex-wrap: wrap;
  border-top: 4px solid #e2d4ff;
  border-bottom: 4px solid #e2d4ff;
}

.benefit {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 220px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(122, 76, 207, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 16px rgba(122, 76, 207, 0.15);
}

.benefit h2{
color: #000;
}

.icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  display: block;
}


.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.steps {
  padding: 2rem;
  background-color: #f9f9f9;
  text-align: center;
}
.contact {
  padding: 2rem;
  text-align: center;
  background-color: #fff;
}

.steps-section {
  background: linear-gradient(to right, #f4e7ff, #fff);
  padding: 3rem 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin: 3rem auto;
  max-width: 900px;
}

.steps-title {
  font-size: 2rem;
  font-weight: bold;
  color: #444;
  margin-bottom: 2rem;
}

.steps-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  gap: 2rem;
}

.steps-list li {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
}

.step-circle {
  background: #55b747;
  color: white;
  font-weight: bold;
  font-size: 1.3rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

  .step-item {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.step-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.step-item:hover .step-circle {
  background: #4aa63e;
  box-shadow: 0 0 12px rgba(85, 183, 71, 0.6);
  transform: scale(1.05);
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}


.step-item.reveal {
  opacity: 1;
  transform: translateY(0);
}


.steps-list li span {
  font-size: 1rem;
  color: #333;
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
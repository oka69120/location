<template>
  <div class="product-detail" v-if="product">
    <!-- Galerie d'images -->
    <div class="gallery">
      <img
        :src="getImage(selectedImage)"
        class="main-image"
        @click="openLightbox(selectedImageIndex)"
      />

      <div class="thumbnails">
        <img
          v-for="(img, i) in product.images"
          :key="i"
          :src="getImage(img)"
          :class="{ active: img === selectedImage }"
          @click="selectImage(i)"
        />
      </div>
    </div>

    <!-- Infos produit -->
    <div class="info">
      <h1>{{ product.name }}</h1>
      <p class="price">{{ product.price.toFixed(2) }} €</p>
      <p class="stock">Stock : {{ product.stock }}</p>
      <p class="category">Catégorie : {{ product.category }}</p>
      <p class="description">{{ product.description }}</p>
      

      <div class="reservation-actions">
  <input
    type="number"
    v-model="quantity"
    :min="1"
    :max="product.stock"
    class="qty-input"
  />

  <button
    class="btn-add"
    @click="reservationStore.addProduct({
    _id: product._id,
    name: product.name,
    price: product.price,
    images: product.images,
    quantity: quantity  // ← important : .value !
})"

    :disabled="reservationStore.hasProduct(product._id)"
  >
    {{ reservationStore.hasProduct(product._id) ? 'Déjà ajouté' : 'Ajouter à ma réservation' }}
  </button>

  <router-link to="/reservation" class="btn-view">
    Voir ma réservation
  </router-link>
</div>

    </div>

    <!-- Lightbox -->
    <div class="lightbox" v-if="showLightbox" @click.self="closeLightbox">
      <button class="close" @click="closeLightbox">✕</button>
      <button class="prev" @click="prevImage">‹</button>
      <img :src="getImage(product.images[selectedImageIndex])" class="lightbox-image" />
      <button class="next" @click="nextImage">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useReservationStore } from '@/store/reservationStore'
const reservationStore = useReservationStore()
const route = useRoute()
const product = ref<any>(null)
const selectedImage = ref('')
const selectedImageIndex = ref(0)
let quantity = 1


const showLightbox = ref(false)

const fetchProduct = async () => {
  const res = await axios.get(`http://localhost:5000/api/products/${route.params.id}`)
  product.value = res.data
  selectedImage.value = product.value.images?.[0] || ''
  selectedImageIndex.value = 0
}

const getImage = (img: string) => `http://localhost:5000/${img}`

const selectImage = (index: number) => {
  selectedImageIndex.value = index
  selectedImage.value = product.value.images[index]
}

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
}

const prevImage = () => {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--
  } else {
    selectedImageIndex.value = product.value.images.length - 1
  }
}

const nextImage = () => {
  if (selectedImageIndex.value < product.value.images.length - 1) {
    selectedImageIndex.value++
  } else {
    selectedImageIndex.value = 0
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
}

.gallery {
  flex: 1;
  min-width: 300px;
}

.main-image {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  object-fit: cover;
  cursor: zoom-in;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.thumbnails {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.qty-input {
  width: 70px;
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: center;
}


.thumbnails img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: border 0.2s;
}

.thumbnails img.active {
  border-color: #55b747;
}

.info {
  flex: 1;
  min-width: 300px;
}

.info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.info .price {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #55b747;
}

.info .stock,
.info .category {
  font-size: 1rem;
  color: #777;
  margin-bottom: 0.5rem;
}

.info .description {
  font-size: 1rem;
  margin-top: 1rem;
  line-height: 1.5;
}

.btn-detail {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #8023f1;
  color: #000;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.btn-detail:hover {
  background-color: #e6b700;
}

.out-of-stock {
  margin-top: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.lightbox-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255,255,255,0.3);
}

.lightbox .close,
.lightbox .prev,
.lightbox .next {
  position: absolute;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
  z-index: 1000;
}

.lightbox .close {
  top: 1rem;
  right: 1rem;
}

.lightbox .prev {
  left: 2rem;
}

.lightbox .next {
  right: 2rem;
}
.reservation-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.btn-add,
.btn-view {
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.btn-add {
  background-color: #55b747;
  color: white;
}
.btn-add:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-view {
  background-color: #3498db;
  color: white;
}
.btn-view:hover {
  background-color: #2980b9;
}

</style>

<template>
  <div class="product-card">
    <div class="image-wrapper" @click="onClickImage?.()">
      <img :src="getImage(product.images)" alt="Produit" />
    </div>
    <h3>{{ product.name }}</h3>
    <p class="price">{{ product.price.toFixed(2) }} €</p>
    <BaseButton :to="`/produits/${product._id}`">
    Voir le détail
  </BaseButton>

  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { API_URL } from '@/api'
defineProps<{
  product: {
    _id: string
    name: string
    price: number
    images: string[]
  },
  onClickImage?: () => void
}>()

const getImage = (imgs: string[]) =>
  imgs.length ? `${API_URL}/${imgs[0]}` : ''
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  background: #ECDDFE;
  width: 100%;
  max-width: 350px;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  cursor: zoom-in;
}

.image-wrapper img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.image-wrapper::before {
  z-index: 2;
  content: '+';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  font-size: 3rem;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 8rem;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.image-wrapper:hover::before {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.price {
  color: #55b747;
  font-weight: bold;
  margin: 0.5rem 0;
}

</style>
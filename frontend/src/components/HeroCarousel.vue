<template>
  <section class="hero-carousel">
    <div
      class="carousel-slide"
      v-for="(slide, index) in slides"
      :key="index"
      :class="{ active: index === currentSlide }"
    >
      <img :src="slide.image" alt="Slide" />
      <div class="overlay">
        <h1>Louez votre matériel événementiel en quelques clics !</h1>
        <BaseButton to="/produits">Voir les produits</BaseButton>

      </div>
    </div>

    <!-- Navigation -->
    <button class="nav left" @click="prevSlide">‹</button>
    <button class="nav right" @click="nextSlide">›</button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

const slides = [
  { image: new URL('@/assets/images/hero-event1.jpg', import.meta.url).href },
  { image: new URL('@/assets/images/hero-event2.jpg', import.meta.url).href },
  { image: new URL('@/assets/images/hero-event3.jpg', import.meta.url).href }
]

const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// ✅ Déclaration typée
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
})

// ✅ Nettoyage au démontage pour éviter l'erreur TS6133
onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>


<style scoped>


.hero-carousel {
  margin-top: -70px;
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
}

.carousel-slide.active {
  opacity: 1;
  z-index: 1;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
}

.overlay h1{
  font-size: 3rem;
  padding-bottom: 60px;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 2;
}
.nav.left {
  left: 1rem;
}
.nav.right {
  right: 1rem;
}
</style>
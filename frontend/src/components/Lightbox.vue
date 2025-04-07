<template>
  <div class="lightbox" v-if="visible" @click.self="close">
    <div class="lightbox-content">
      <button class="close" @click="close">×</button>
      <img :src="getImage(currentImage)" alt="Image zoomée" />
      <div class="nav">
        <button @click.stop="prevImage" :disabled="currentIndex === 0">←</button>
        <button @click.stop="nextImage" :disabled="currentIndex === images.length - 1">→</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  images: string[]
  visible: boolean
}>()

const emit = defineEmits(['close'])

const currentIndex = ref(0)

watch(() => props.visible, (val) => {
  if (val) currentIndex.value = 0
})

const currentImage = computed(() => props.images[currentIndex.value])

const getImage = (img: string) => `http://localhost:5000/${img}`

const close = () => emit('close')

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}
.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}
.close {
  position: absolute;
  top: -30px;
  right: -30px;
  font-size: 2rem;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
}
.nav {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.nav button {
  background: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}
.nav button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
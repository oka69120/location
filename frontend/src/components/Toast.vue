<template>
  <div v-if="visible" class="toast" :class="type">
    {{ message }}
  </div>
</template>

<script setup lang="ts">

defineProps<{
  message: string
  type: 'success' | 'error'
  visible: boolean
}>()
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  z-index: 9999;
  animation: fade 0.3s ease-in-out;
}

.toast.success {
  background-color: #55b747;
}

.toast.error {
  background-color: #d9534f;
}

@keyframes fade {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>

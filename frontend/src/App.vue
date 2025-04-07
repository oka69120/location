<template>
  <div>
    <HeaderComponent />
    <main>
      <router-view />
    </main>
    
    <!-- ✅ Toast global -->
    <Toast
      :message="toast.message"
      :type="toast.type"
      :visible="toast.visible"
    />

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import Toast from '@/components/Toast.vue'
import { useToastStore } from '@/store/toastStore'
import { useUserStore } from '@/store/userStore'

const toast = useToastStore()
const userStore = useUserStore()
userStore.loadUserFromStorage()
</script>

<style scoped>
main {
  min-height: 70vh;
}

</style>

<template>
  <AdminLayout>
  <div class="admin-layout">

    <main class="content">
      <h2>Bienvenue dans l'espace d'administration</h2>
      <p>Connecté en tant que : <strong>{{ userStore.user?.role }}</strong></p>
    </main>
  </div>
</AdminLayout>
</template>

<script setup lang="ts">

import { useUserStore } from '@/store/userStore'
import AdminLayout from '@/layouts/AdminLayout.vue'

const userStore = useUserStore()


</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 80vh;
}

.sidebar {
  width: 220px;
  background-color: #f0f0f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid #ddd;
}

.sidebar h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.sidebar a {
  color: #333;
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
}

.sidebar a.router-link-exact-active {
  background-color: #55b747;
  color: white;
}

.logout {
  margin-top: 1rem;
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 2rem;
}
</style>

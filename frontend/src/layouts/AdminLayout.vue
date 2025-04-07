<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h3>Admin</h3>
      <nav>
        <RouterLink to="/admin">Dashboard</RouterLink>
        <RouterLink to="/admin/utilisateurs">Utilisateurs</RouterLink>
        <RouterLink to="/admin/produits">Produits</RouterLink>
        <RouterLink to="/admin/demandes">Demandes</RouterLink>
        <router-link to="/admin/categories" class="admin-link" :class="{ active: $route.path === '/admin/categories' }"> 📂 Catégories
</router-link>
        <button class="logout" @click="logout">Déconnexion</button>
      </nav>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.clearUser()
  router.push('/login')
}
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

.admin-link {
  display: block;
  padding: 0.6rem 1rem;
  text-decoration: none;
  color: inherit;
}
.admin-link.active {
  background-color: #8023f1;
  font-weight: bold;
}
</style>

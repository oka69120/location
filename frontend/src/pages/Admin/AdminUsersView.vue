<template>
  <AdminLayout>
  <div class="admin-users">
    <h2>Gestion des utilisateurs</h2>

    <!-- Formulaire création -->
    <form @submit.prevent="createUser" class="form">
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Mot de passe" required />
      <select v-model="form.role" required>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Créer utilisateur</button>
    </form>

    <hr />

    <!-- Liste des utilisateurs -->
    <table class="user-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button
              class="btn-delete"
              @click="deleteUser(user._id)"
              v-if="user._id !== currentUserId"
            >
              Supprimer
            </button>
            <span v-else style="color: gray;">Vous</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useToastStore } from '@/store/toastStore'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { API_URL } from '@/api'

interface User {
  _id: string
  email: string
  role: 'admin' | 'manager'
}

const users = ref<User[]>([])
const form = ref({ email: '', password: '', role: 'manager' })
const toast = useToastStore()


// Décoder le token pour obtenir l’ID de l’utilisateur connecté
const token = localStorage.getItem('token')
let currentUserId = ''
if (token) {
  const decoded = jwtDecode<{ userId: string }>(token)
  currentUserId = decoded.userId
}

// Charger les utilisateurs
const fetchUsers = async () => {
  try {
    const res = await axios.get('${API_URL}/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = res.data
  } catch (err) {
    console.error('Erreur chargement utilisateurs', err)
    toast.show('Erreur chargement utilisateurs', 'error')
  }
}

// Créer un nouvel utilisateur
const createUser = async () => {
  try {
    await axios.post('${API_URL}/api/auth/users', form.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    form.value.email = ''
    form.value.password = ''
    form.value.role = 'manager'
    await fetchUsers()
    toast.show('Utilisateur créé avec succès ✅', 'success')
  } catch (err) {
    console.error('Erreur création utilisateur', err)
    toast.show('Erreur lors de la création ❌', 'error')
  }
}

// Supprimer un utilisateur
const deleteUser = async (userId: string) => {
  if (!confirm('Supprimer cet utilisateur ?')) return

  try {
    await axios.delete(`${API_URL}/api/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    toast.show('Utilisateur supprimé avec succès', 'success')
    await fetchUsers()
  } catch (err) {
    console.error('Erreur suppression utilisateur', err)
    toast.show('Erreur lors de la suppression', 'error')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

input, select {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  background-color: #55b747;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.user-table th,
.user-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.btn-delete {
  background-color: #d9534f;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

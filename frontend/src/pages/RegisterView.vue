<template>
  <div class="register-container">
    <h2>Créer un utilisateur</h2>

    <form @submit.prevent="register" class="form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <select v-model="role" required>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/store/toastStore'

const email = ref('')
const password = ref('')
const role = ref<'manager' | 'admin'>('manager')

const toast = useToastStore()
const router = useRouter()

const register = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.show('Connexion requise pour créer un utilisateur', 'error')
    return
  }

  try {
    await axios.post('${API_URL}/api/auth/users', {
      email: email.value,
      password: password.value,
      role: role.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.show('Utilisateur créé avec succès ✅', 'success')
    router.push('/admin/utilisateurs')
  } catch (err) {
    console.error('Erreur création utilisateur', err)
    toast.show('Erreur lors de la création ❌', 'error')
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 3rem auto;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

input, select {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  background-color: #55b747;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>

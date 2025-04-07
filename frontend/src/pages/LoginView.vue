<template>
  <div class="login-container">
    <h2>Connexion administrateur</h2>

    <form @submit.prevent="login" class="form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/store/toastStore'
import { useUserStore } from '@/store/userStore'

const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToastStore()
const userStore = useUserStore()

const login = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = res.data.token
    userStore.setToken(token)
    toast.show('Connexion réussie ✅', 'success')
    router.push('/admin')
  } catch (err) {
    console.error('Erreur login', err)
    toast.show('Email ou mot de passe incorrect ❌', 'error')
  }
}
</script>

<style scoped>
.login-container {
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

input {
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

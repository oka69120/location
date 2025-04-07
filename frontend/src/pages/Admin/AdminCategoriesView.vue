<template>
  <AdminLayout>
    <div class="admin-categories">
      <h2>Gestion des catégories</h2>

      <form @submit.prevent="submitCategory" class="form-inline">
        <input
          v-model="newCategory"
          placeholder="Nouvelle catégorie"
          required
        />
        <button type="submit">{{ editingId ? 'Modifier' : 'Ajouter' }}</button>
      </form>

      <ul class="category-list">
        <li v-for="cat in categories" :key="cat._id">
        <span>{{ cat.name }} <strong v-if="cat.count !== undefined">({{ cat.count }})</strong></span>
        <div class="actions">
          <button @click="editCategory(cat)">Modifier</button>
          <button @click="deleteCategory(cat._id)">Supprimer</button>
        </div>
      </li>

      </ul>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToastStore } from '@/store/toastStore'

const toast = useToastStore()

interface Category {
  _id: string
  name: string
  count?: number 
}

const categories = ref<Category[]>([])
const newCategory = ref('')
const editingId = ref<string | null>(null)

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/categories/with-count')
    categories.value = res.data
  } catch (err) {
    toast.show('Erreur chargement catégories ❌', 'error')
  }
}


const submitCategory = async () => {
  try {
    const token = localStorage.getItem('token')
    if (editingId.value) {
      await axios.put(
        `http://localhost:5000/api/categories/${editingId.value}`,
        { name: newCategory.value },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.show('Catégorie modifiée ✅', 'success')
    } else {
      await axios.post(
        'http://localhost:5000/api/categories',
        { name: newCategory.value },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.show('Catégorie ajoutée ✅', 'success')
    }
    newCategory.value = ''
    editingId.value = null
    fetchCategories()
  } catch (err) {
    toast.show('Erreur lors de l’enregistrement ❌', 'error')
  }
}

const editCategory = (cat: Category) => {
  newCategory.value = cat.name
  editingId.value = cat._id
}

const deleteCategory = async (id: string) => {
  if (!confirm('Supprimer cette catégorie ?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    toast.show('Catégorie supprimée ✅', 'success')
    fetchCategories()
  } catch (err) {
    toast.show('Erreur suppression ❌', 'error')
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.admin-categories {
  max-width: 600px;
  margin: auto;
}

.form-inline {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-inline input {
  flex: 1;
  padding: 0.5rem;
}

.form-inline button {
  background-color: #55b747;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid #eee;
}

.category-list .actions button {
  margin-left: 0.5rem;
  background-color: #8023f1;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.category-list .actions button:last-child {
  background-color: #d9534f;
  color: white;
}
li span strong {
  color: #555;
  font-weight: normal;
}

</style>

<template>
  <div class="reservation-page">
    <h1>Ma réservation</h1>

    <div v-if="store.items.length === 0" class="empty">
      Aucun produit n’a été ajouté à votre réservation.
    </div>

    <div v-else class="reservation-content">
      <!-- Produits sélectionnés -->
      <div class="product-list">
        <div v-for="item in store.items" :key="item._id" class="product-card">
          <img :src="getImage(item.images[0])" />
          <div class="info">
            <h3>{{ item.name }}</h3>
            <p>Prix : {{ item.price.toFixed(2) }} €</p>
            <label>Quantité :</label>
            <input
              type="number"
              min="1"
              v-model.number="item.quantity"
              @change="store.updateQuantity(item._id, item.quantity)"
            />
            <p><strong>Total :</strong> {{ (item.quantity * item.price).toFixed(2) }} €</p>
            <button @click="store.removeProduct(item._id)">Supprimer</button>
          </div>
        </div>

        <!-- Total global -->
        <div class="total-section">
          <hr />
          <p class="total-amount">
            Total de la réservation :
            <strong>{{ totalPrice.toFixed(2) }} €</strong>
          </p>
        </div>
      </div>

      <!-- Formulaire de réservation -->
      <form class="reservation-form-modern" @submit.prevent="submitReservation">
        <h2 class="form-title">📝 Finaliser ma réservation</h2>

        <!-- Coordonnées -->
        <div class="form-card">
          <h3 class="form-section-title">Vos coordonnées</h3>
          <div class="form-grid">
            <div>
              <label>Nom complet</label>
              <div class="input-icon">
                <input v-model="form.fullName" required placeholder="Jean Dupont" />
                <span v-if="form.fullName" :class="{ valid: form.fullName.length >= 2, invalid: form.fullName.length < 2 }">
                  {{ form.fullName.length >= 2 ? '✔' : '✖' }}
                </span>
              </div>
            </div>
            <div>
              <label>Téléphone</label>
              <div class="input-icon">
                <input
                  type="tel"
                  v-model="form.phone"
                  required
                  placeholder="06 12 34 56 78"
                  @input="validatePhone"
                />
                <span v-if="form.phone" :class="{ valid: !phoneError, invalid: !!phoneError }">
                  {{ !phoneError ? '✔' : '✖' }}
                </span>
              </div>
            </div>

            <div>
              <label>Email</label>
              <div class="input-icon">
                <input type="email" v-model="form.email" required placeholder="exemple@mail.com" @input="validateEmail" />
                <span v-if="form.email" :class="{ valid: !emailError, invalid: !!emailError }">
                  {{ !emailError ? '✔' : '✖' }}
                </span>
              </div>
            </div>
            <div class="full">
              <label>Adresse complète</label>
              <div class="input-icon">
                <input v-model="form.address" required placeholder="10 rue des Lilas, 75000 Paris" />
                <span v-if="form.address" :class="{ valid: true }">✔</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Type de client -->
        <div class="form-card">
          <h3 class="form-section-title">Type de client</h3>
          <div class="form-grid">
            <div>
              <label>Vous êtes</label>
              <select v-model="form.customerType">
                <option value="particulier">Particulier</option>
                <option value="société">Société</option>
              </select>
            </div>
            <div v-if="form.customerType === 'societe'">
              <label>Nom de la société</label>
              <input v-model="form.companyName" placeholder="Ma super société" />
            </div>
          </div>
        </div>

        <!-- Événement -->
        <div class="form-card">
          <h3 class="form-section-title">Détails de l’événement</h3>
          <div class="form-grid">
            <div>
              <label>Type d’événement</label>
              <select v-model="form.eventType" required>
                <option disabled value="">Sélectionner un type</option>
                <option value="mariage">Mariage</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="cocktail">Cocktail</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label>Date de début</label>
              <input type="date" v-model="form.startDate" required :min="minDate" />
            </div>
            <div>
              <label>Date de fin</label>
              <input type="date" v-model="form.endDate" required :min="form.startDate || minDate" />
              <small v-if="form.endDate && form.endDate < form.startDate" class="form-error">
                La date de fin doit être postérieure à la date de début
              </small>
            </div>
          </div>
        </div>

        <!-- Commentaire -->
        <div class="form-card">
          <h3 class="form-section-title">Commentaire (facultatif)</h3>
          <div class="input-icon">
            <textarea v-model="form.comment" placeholder="Détails spécifiques, horaires, consignes..."></textarea>
            <span v-if="form.comment" :class="{ valid: form.comment.length >= 10, invalid: form.comment.length < 10 }">
              {{ form.comment.length >= 10 ? '✔' : '✖' }}
            </span>
          </div>
        </div>

        <!-- Résumé -->
        <div class="form-card">
          <h3 class="form-section-title">🧾 Résumé de la réservation</h3>
          <div v-if="store.items.length > 0">
            <ul class="recap-list">
              <li v-for="item in store.items" :key="item._id">
                {{ item.quantity }} × {{ item.name }} = {{ (item.quantity * item.price).toFixed(2) }} €
              </li>
            </ul>
            <p class="recap-total">
              Total : <strong>{{ totalPrice.toFixed(2) }} €</strong>
            </p>
          </div>
          <div v-else class="recap-empty">Aucun produit sélectionné.</div>
        </div>

        <!-- Bouton -->
        <div class="form-actions">
          <button
            type="button"
            :disabled="store.items.length === 0 || !!emailError || form.endDate < form.startDate"
            @click="confirmSubmit"
          >
            ✅ Envoyer ma demande
          </button>
        </div>
      </form>
    </div>

    <!-- Modale de confirmation -->
    <transition name="modal-fade">
      <div v-if="showConfirmation" class="modal-overlay">
        <div class="modal-content">
          <h3>Confirmer l’envoi</h3>
          <p>Souhaitez-vous vraiment envoyer votre demande de réservation ?</p>
          <div class="modal-actions">
            <button @click="confirmAndSubmit">✅ Oui, envoyer</button>
            <button @click="cancelSubmit" class="cancel">❌ Annuler</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>



<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReservationStore } from '@/store/reservationStore'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import emailjs from '@emailjs/browser'
import type { AxiosError } from 'axios'

const store = useReservationStore()
const toast = useToast()
const emailError = ref('')
const minDate = new Date().toISOString().split('T')[0]



const getImage = (img: string) => `http://localhost:5000/${img}`

const form = ref({
  fullName: '',
  phone: '',
  address: '',
  email: '',
  customerType: 'particulier',
  companyName: '',
  eventType: '',
  startDate: '',
  endDate: '',
  comment: ''

})

const totalPrice = computed(() => {
  return store.items.reduce(
    (total: number, item: { quantity: number; price: number }) =>
      total + item.quantity * item.price,
    0
  )
})



const validateEmail = (event?: Event) => {
  const input = event?.target as HTMLInputElement
  const value = input?.value || ''
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = regex.test(value) ? '' : 'Adresse email invalide'
}

const phoneError = ref('')

const validatePhone = (event?: Event) => {
  const input = event?.target as HTMLInputElement
  const value = input?.value || ''
  const isValid = /^\d{10}$/.test(value)
  phoneError.value = isValid ? '' : 'Numéro invalide'
}



const showConfirmation = ref(false)

const confirmSubmit = () => {
  // vérifie champs obligatoires
  const requiredFields = [
    form.value.fullName,
    form.value.email,
    form.value.phone,
    form.value.address,
    form.value.eventType,
    form.value.startDate,
    form.value.endDate
  ]

  const hasEmpty = requiredFields.some(f => !f || f.trim() === '')

  if (hasEmpty || !!emailError.value || store.items.length === 0) {
    toast.error('Veuillez remplir tous les champs obligatoires.')

    return
  }

  // si tout est bon : on affiche la modale
  showConfirmation.value = true
}


const cancelSubmit = () => {
  showConfirmation.value = false
}



const confirmAndSubmit = async () => {
  showConfirmation.value = false
  await submitReservation()
}


const sendEmailJS = async () => {
  try {
    await emailjs.send(
      'service_1ljay4h',        // ID du service
      'template_bf96zgh',       // ID du template
      {
    fullName: form.value.fullName,
    email: form.value.email,
    phone: form.value.phone,
    address: form.value.address,
    eventType: form.value.eventType,
    customerType: form.value.customerType,
    companyName: form.value.companyName || '—',
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    comment: form.value.comment || '—',
    totalPrice: totalPrice.value.toFixed(2)
  },
      '2lqdLLix1ANz6qRv-'         // Clé publique EmailJS
    )
    toast.success('📩 Email envoyé via EmailJS')
  } catch (err) {
    console.error('Erreur EmailJS :', err)
    toast.error('Erreur lors de l’envoi par EmailJS')
  }
}


const submitReservation = async () => {
  try {
    const total = store.items.reduce(
  (acc: number, item: { quantity: number; price: number }) => acc + item.quantity * item.price,
  0
)

    const payload = {
      fullName: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      eventLocation: form.value.address, // ou un champ dédié si tu veux séparer
      eventType: form.value.eventType,
      clientType: form.value.customerType, // 🔄 renommé pour correspondre au backend
      companyName: form.value.companyName || '',
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      message: form.value.comment || '',
      totalPrice: total,
      products: store.items.map((p: { _id: string; name: string; quantity: number; price: number }) => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price
      }))
    }

    console.log('📤 Payload final envoyé :', payload)

    await axios.post('http://localhost:5000/api/orders', payload)
    await sendEmailJS()
    toast.success('Demande envoyée avec succès ✅')
    store.clearReservation()

    form.value = {
      fullName: '',
      phone: '',
      address: '',
      email: '',
      customerType: 'particulier',
      companyName: '',
      eventType: '',
      startDate: '',
      endDate: '',
      comment: ''
    }
  } catch (error: unknown) {
  const err = error as AxiosError<any>
  const msg = err.response?.data?.error || 'Erreur lors de l’envoi'
  toast.error(msg)
}


}
</script>

<style scoped>
.reservation-page {
  padding: 2rem;
}

.empty {
  font-style: italic;
  color: #777;
}

.reservation-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.product-list {
  flex: 1;
  min-width: 300px;
}

.product-card {
  display: flex;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.product-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.product-card .info {
  padding: 0.5rem;
  flex: 1;
}

.product-card input[type='number'] {
  width: 60px;
  margin-left: 0.5rem;
}

.product-card button {
  margin-top: 0.5rem;
  background: #e74c3c;
  border: none;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.total-section {
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 6px;
  margin-top: 1rem;
}

.total-amount {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
}

.reservation-form-modern {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  margin: auto;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.form-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}


.full {
  grid-column: span 2;
}

label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #55b747;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.form-actions {
  text-align: right;
}

.form-actions button {
  background: #55b747;
  color: white;
  font-weight: 600;
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.form-actions button:hover {
  background: #4aa63e;
}

.recap-list {
  list-style: none;
  padding-left: 0;
  margin: 0 0 1rem 0;
}

.recap-list li {
  padding: 0.3rem 0;
  border-bottom: 1px dashed #ddd;
  font-size: 0.95rem;
}

.recap-total {
  text-align: right;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.recap-empty {
  font-style: italic;
  color: #777;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  gap: 1rem;
}

.modal-actions button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.modal-actions button:first-child {
  background: #55b747;
  color: white;
}

.modal-actions .cancel {
  background: #e74c3c;
  color: white;
}

/* Animation modale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.form-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  display: block;
}

.input-icon {
  position: relative;
}

.input-icon input,
.input-icon textarea {
  padding-right: 2rem;
}

.input-icon span {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: bold;
}

.valid {
  color: #2ecc71;
}

.invalid {
  color: #e74c3c;
}
</style>

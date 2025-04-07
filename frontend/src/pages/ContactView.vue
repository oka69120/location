<template>
  <div class="contact-background">
    <div class="contact-page">
      <h1>Contactez-nous</h1>
      <p class="intro">
        Une question, une demande spéciale ? N'hésitez pas à nous écrire, nous vous répondrons rapidement.
      </p>

      <form class="contact-form" @submit.prevent="sendMessage">
        <div class="form-grid">
          <div>
            <label>Nom complet</label>
            <div class="input-icon">
              <input type="text" v-model="form.fullName" required placeholder="Jean Dupont" />
              <span v-if="form.fullName" :class="{ valid: form.fullName.length >= 2, invalid: form.fullName.length < 2 }">{{ form.fullName.length >= 2 ? '✔' : '✖' }}</span>
            </div>
          </div>
          <div>
            <label>Téléphone</label>
            <div class="input-icon">
              <input type="tel" v-model="form.phone" required placeholder="06 12 34 56 78" />
              <span v-if="form.phone" :class="{ valid: /^\d{10}$/.test(form.phone), invalid: !/^\d{10}$/.test(form.phone) }">
                {{ /^\d{10}$/.test(form.phone) ? '✔' : '✖' }}
              </span>
            </div>
          </div>
          <div>
            <label>Email</label>
            <div class="input-icon">
              <input type="email" v-model="form.email" required placeholder="exemple@mail.com" @input="validateEmail" />
              <span v-if="form.email" :class="{ valid: !emailError, invalid: !!emailError }">{{ !emailError ? '✔' : '✖' }}</span>
            </div>
          </div>
          <div class="full">
            <label>Adresse complète</label>
            <div class="input-icon">
              <input type="text" v-model="form.address" required placeholder="10 rue des Lilas, 75000 Paris" />
              <span v-if="form.address" :class="{ valid: true }">✔</span>
            </div>
          </div>
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
            <small v-if="form.endDate && form.endDate < form.startDate" class="error">La date de fin doit être postérieure à la date de début</small>
          </div>
          <div class="full">
            <label>Message</label>
            <div class="input-icon">
              <textarea v-model="form.message" required placeholder="Votre message ou vos précisions..."></textarea>
              <span v-if="form.message" :class="{ valid: form.message.length >= 10, invalid: form.message.length < 10 }">
                {{ form.message.length >= 10 ? '✔' : '✖' }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="!isFormValid" :class="{ faded: !isFormValid }">📩 Envoyer</button>
        </div>
      </form>

      <div class="infos">
        <h2>Nos coordonnées</h2>
        <p>📍 10 rue des Lilas, 75000 Paris</p>
        <p>📞 06 12 34 56 78</p>
        <p>📧 contact@locaevent.fr</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import emailjs from '@emailjs/browser'

const toast = useToast()

const form = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  eventType: '',
  startDate: '',
  endDate: '',
  message: ''
})

const emailError = ref('')
const minDate = new Date().toISOString().split('T')[0]

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = regex.test(form.value.email) ? '' : 'Adresse email invalide'
}

const isFormValid = computed(() => {
  return (
    form.value.fullName.length >= 2 &&
    /^\d{10}$/.test(form.value.phone) &&
    !emailError.value &&
    form.value.address.length > 0 &&
    form.value.eventType.length > 0 &&
    form.value.startDate &&
    form.value.endDate &&
    form.value.endDate >= form.value.startDate &&
    form.value.message.length >= 10
  )
})

const sendMessage = async () => {
  try {
    await emailjs.send('service_1ljay4h', 'template_contactform', {
      fullName: form.value.fullName,
      phone: form.value.phone,
      email: form.value.email,
      address: form.value.address,
      eventType: form.value.eventType,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      message: form.value.message
    }, '2lqdLLix1ANz6qRv-')

    toast.success('Message envoyé avec succès ✅')
    form.value = {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      eventType: '',
      startDate: '',
      endDate: '',
      message: ''
    }
  } catch (error) {
    console.error('Erreur envoi contact :', error)
    toast.error('Erreur lors de l’envoi du message ❌')
  }
}
</script>

<style scoped>
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

.faded {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.contact-page {
  margin-top: 100px !important;
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}

.contact-background {
  margin-top: -70px !important;
  position: relative;
  min-height: 100vh;
  background: url('@/assets/images/hero-event.jpg') no-repeat center center / cover;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.contact-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* Calque sombre */
  z-index: 0;
}

.contact-page {
  position: relative;
  z-index: 1;
  background: rgba(252, 252, 252, 0.65); /* ✅ blanc transparent */
  padding: 2rem;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  margin: 2rem auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}



h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.intro {
  text-align: center;
  margin-bottom: 2rem;
  color: #555;
}

.contact-form {
  
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.full {
  grid-column: span 2;
}

label {
  margin-bottom: 0.3rem;
  font-weight: 500;
  display: block;
}

input,
select,
textarea {
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  text-align: right;
}

.form-actions button {
  background: #55b747;
  color: white;
  border: none;
  padding: 0.8rem 1.6rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.form-actions button:hover {
  background: #4aa63e;
}

.infos {
  background: #f8f8f8;
  padding: 1.5rem;
  border-radius: 8px;
  color: #333;
  line-height: 1.6;
}

.infos h2 {
  margin-bottom: 1rem;
}

.error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  display: block;
}

@media (max-width: 768px) {
  .contact-form,
  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .form-actions {
    text-align: center;
  }

  .contact-page {
    padding: 1.5rem;
    margin: 1rem;
  }

  .contact-background {
    align-items: flex-start;
    padding-top: 2rem;
  }
}

</style>

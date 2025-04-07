import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './store'
import '@/assets/reset.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Toast)
app.mount('#app')


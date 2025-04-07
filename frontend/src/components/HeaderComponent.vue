<template>
  <header class="header" :class="{ scrolled, darkMode }">
    <transition name="fade-slide">
      <div class="container">
        <!-- Logo / Nom du site -->
        <router-link to="/" class="logo">🎉 LocaEvent</router-link>

        <!-- Menu desktop -->
         <!-- Juste en dessous du menu -->
        <div class="mobile-overlay" :class="{ active: menuOpen }" @click="closeMenu" />
        <nav class="nav" :class="{ open: menuOpen }">
          <button class="close-btn" @click="closeMenu">
            <X size="26" />
          </button>

          <router-link to="/" @click="closeMenu" :class="{ active: route.path === '/' }">Accueil</router-link>
          <router-link to="/produits" @click="closeMenu" :class="{ active: route.path.startsWith('/produits') }">Produits</router-link>
          <router-link to="/reservation" @click="closeMenu" :class="{ active: route.path.startsWith('/reservation') }">Réservation</router-link>
          <router-link to="/contact" @click="closeMenu" :class="{ active: route.path.startsWith('/contact') }">Contact</router-link>
        </nav>
        <!-- Burger menu -->
        <button class="burger" @click="menuOpen = !menuOpen">
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { X } from 'lucide-vue-next'

const menuOpen = ref(false)
const scrolled = ref(false)
const darkMode = ref(false)
const route = useRoute()



const closeMenu = () => (menuOpen.value = false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
  border-bottom: 1px solid #ddd;
}

.header.scrolled {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: #2a044b;
}

.header.darkMode {
  background: #222;
  border-color: #444;
}

.header.darkMode .logo,
.header.darkMode .nav a {
  color: white;
}

.container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.logo {
  font-weight: bold;
  font-size: 1.4rem;
  text-decoration: none;
  color: white;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  position: relative;
  text-decoration: none;
  color: white;
  font-weight: 800;
  transition: color 0.2s, transform 0.2s;
}

.nav a:hover {
  color: #55b747;
  transform: scale(1.1);
}

.nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: #55b747;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav a:hover::after {
  transform: scaleX(1);
}

.nav a.active {
  color: #55b747;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.burger span {
  display: block;
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.burger span.open:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}
.close-btn {
  display: none; /* Masqué par défaut */
}

@media (max-width: 768px) {

  .close-btn {
    display: block;
  }
    .nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px; /* ou 80vw si tu veux plus souple */
    background: #2a044b;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem 1.5rem;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
    transform: translateX(100%); /* ← CACHÉ à droite */
    opacity: 0;
    pointer-events: none;
    transition: transform 0.4s ease, opacity 0.3s ease;
    z-index: 100;
    border-radius: 20px 0 0 20px ;
  }

  .nav.open {
    transform: translateX(0);     /* ← ENTRE par la droite */
    opacity: 1;
    pointer-events: auto;
  }

    .burger {
      display: flex;
    }

    .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .mobile-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }


}

/* Animation d’apparition */
.fade-slide-enter-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.close-btn {
  align-self: flex-end;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}


</style>

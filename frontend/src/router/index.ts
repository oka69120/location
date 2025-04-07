import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import HomeView from '@/pages/HomeView.vue'
import ProduitsView from '@/pages/ProduitsView.vue'
import DemandeView from '@/pages/DemandeView.vue'
import AdminOrdersView from '@/pages/Admin/AdminOrdersView.vue'
import AdminUsersView from '@/pages/Admin/AdminUsersView.vue'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/RegisterView.vue'
import AdminView from '@/pages/Admin/AdminView.vue'
import AdminProductsView from '@/pages/Admin/AdminProductsView.vue'
import AdminCategoriesView from '@/pages/Admin/AdminCategoriesView.vue'
import ReservationView from '@/pages/ReservationView.vue'
import ContactView from '@/pages/ContactView.vue' //

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/produits', name: 'Produits', component: ProduitsView },
  { path: '/demande', name: 'Demande', component: DemandeView },
  { path: '/contact', name: 'Contact', component: ContactView },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/admin/utilisateurs',
    name: 'AdminUsers',
    component: AdminUsersView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/demandes',
    name: 'AdminOrders',
    component: AdminOrdersView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/produits',
    name: 'AdminProducts',
    component: AdminProductsView,
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: AdminCategoriesView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/produits/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetailView.vue')
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: ReservationView
  }
  

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles as string[] | undefined

  const token = localStorage.getItem('token')

  if (requiresAuth) {
    if (!token) {
      return next('/login')
    }

    try {
      const decoded = jwtDecode<{ userId: string, role: string }>(token)

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return next('/login') // ou une page "Accès refusé"
      }

      return next()
    } catch (err) {
      console.error('Token invalide', err)
      return next('/login')
    }
  }

  next()
})


export default router

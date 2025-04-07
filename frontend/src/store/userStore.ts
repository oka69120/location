import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface User {
  userId: string
  role: string
  email?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)

      const decoded = jwtDecode<User>(token)
      this.user = decoded
    },
    clearUser() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    loadUserFromStorage() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded = jwtDecode<User>(token)
          this.token = token
          this.user = decoded
        } catch (err) {
          this.clearUser()
        }
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isManager: (state) => state.user?.role === 'manager'
  }
})

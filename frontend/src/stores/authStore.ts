import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user.type'
import { login as loginService } from '@/services/auth'
import { register as registerService } from '@/services/auth'
import type { AuthUser, RegisterRequest } from '@/types/auth.type'

const USER_KEY = 'petvalley_user'
const TOKEN_KEY = 'petvalley_token'

export const useAuthStore = defineStore('auth', () => {
  // ===== STATE =====
  const user = ref<AuthUser | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  )

  const token = ref<string | null>(
    localStorage.getItem(TOKEN_KEY)
  )

  const loading = ref(false)

  // ===== GETTERS =====
  const isAuthenticated = computed(() => !!token.value)

  // ===== ACTIONS =====
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response: any = await loginService(email, password)

      user.value = response.user
      token.value = response.token

      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      localStorage.setItem(TOKEN_KEY, response.token)
    } finally {
      loading.value = false
    }
  }

  async function register(body: RegisterRequest) {
    loading.value = true
    try {
      const response: any = await registerService(body)

      user.value = response.user
      token.value = response.token

      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      localStorage.setItem(TOKEN_KEY, response.token)
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/'
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register
  }
})

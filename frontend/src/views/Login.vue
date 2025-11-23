<template>
  <div>
    <Navbar />
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <Card>
            <template #title>
              <div class="text-center">
                <i class="pi pi-user" style="font-size: 2rem"></i>
                <h4 class="mt-2">Login</h4>
              </div>
            </template>
            <template #content>
              <form @submit.prevent="handleLogin">
                <div class="field mb-3">
                  <label for="email" class="form-label">Email</label>
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-100"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div class="field mb-4">
                  <label for="password" class="form-label">Senha</label>
                  <Password
                    id="password"
                    v-model="form.password"
                    class="w-100"
                    placeholder="Sua senha"
                    :feedback="false"
                    toggleMask
                    required
                  />
                </div>
                <Button
                  label="Entrar"
                  type="submit"
                  icon="pi pi-sign-in"
                  class="w-100 p-button-primary"
                  :loading="loading"
                />
              </form>
              <div class="text-center mt-3">
                <small class="text-muted">
                  Não tem conta?
                  <a href="#" class="ms-1">Cadastre-se</a>
                </small>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const loading = ref(false)

const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  loading.value = true
  // Simulação de login (não funcional)
  setTimeout(() => {
    loading.value = false
    alert('Login realizado com sucesso! (simulação)')
    router.push('/')
  }, 1500)
}
</script>

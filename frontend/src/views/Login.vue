<template>
  <div>
    <Navbar />
    <div class="back">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <Card>
            <template #title>
              <div class="text-center">
                <img src="/logo.png" alt="Logo" width="80" />
                <!-- <i class="pi pi-user" style="font-size: 2rem"></i> -->
                <!-- <h4 class="mt-2">Faça login</h4> -->
              </div>
            </template>
            <template #content>
              <form @submit.prevent="handleLogin">
                <div class="field mb-3">
                  <label for="email" class="form-label">Email</label>
                  <InputText id="email" v-model="form.email" type="email" class="w-100" placeholder="Seu email"
                    required />
                </div>
                <div class="field">
                  <label for="password" class="form-label">Senha</label>
                  <InputText id="password" v-model="form.password" :type="passwordType" class="w-100"
                    placeholder="Sua senha" required />
                </div>
                <div class="check-pass flex justify-content-start">
                  <Checkbox v-model="checked" binary /> Mostrar senha
                </div>
                <Button label="Entrar" type="submit" icon="pi pi-sign-in" class="w-100 p-button-primary"
                  :loading="authStore.loading" />
              </form>
              <div class="text-center mt-3">
                <small class="text-muted">
                  Não tem conta?
                  <a href="#" class="ms-1" @click.prevent="handleRegister">Cadastre-se</a>
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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const loading = ref(false)
const passwordType = ref('password')
const checked = ref(false)
const authStore = useAuthStore()

watch(checked, (newValue) => {
  passwordType.value = newValue ? 'text' : 'password'
})

const form = ref({
  email: '',
  password: '',
})

const handleRegister = () => {
  router.push('/cadastro')
}

const handleLogin = async () => {
  try {
    await authStore.login(form.value.email, form.value.password);
    const isAdmin = computed(() => authStore.user?.role === 'admin')
    const isOrganization = computed(() => authStore.user?.role === 'organization')

    if (isAdmin.value) {
      router.push('/admin/dashboard')
      return
    }

    else if (isOrganization.value) {
      router.push('/org/animais')
      return
    }
    else {
      router.push('/')
    }

    if (isAdmin.value) {
      router.push('/admin/dashboard')
      return
    }

    router.push('/')
  } catch (error) {
    alert('Email ou senha inválidos')
  }
}

</script>

<style scoped>
.back {
  background: linear-gradient(rgba(40, 94, 97, 0.8), rgba(40, 94, 97, 0.9)),
    url("/login-background.jpg") no-repeat center center;
  background-size: cover;
  color: white;
  padding: 100px;
}

.check-pass {
  padding-bottom: 1.5rem;
  padding-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
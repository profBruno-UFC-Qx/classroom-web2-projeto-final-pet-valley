<template>
  <div>
    <Navbar />
    <div class="back" style="overflow-x: hidden;">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4 p-5">
          <Card>
            <template #title>
              <div class="text-center">
                <img src="/logo.png" alt="Logo" width="80" />
                <h4 class="mt-2">Faça parte da nossa comunidade</h4>
              </div>
            </template>
            <template #content>
              <Tabs value="0">
                <TabList>
                  <Tab value="0">Adotante</Tab>
                  <Tab value="1">Doador</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel value="0">
                    <form @submit.prevent="handleRegister(false)">
                      <div class="field mb-3">
                        <label for="adotante-name" class="form-label">Nome</label>
                        <InputText id="adotante-name" v-model="form.name" type="text" class="w-100"
                          placeholder="Seu nome" required />
                      </div>
                      <div class="field mb-3">
                        <label for="adotante-email" class="form-label">Email</label>
                        <InputText id="email" v-model="form.email" type="email" class="w-100" placeholder="Seu email"
                          required />
                      </div>
                      <div class="field mb-3">
                        <label for="adotante-password" class="form-label">Senha</label>
                        <InputText id="adotante-password" v-model="form.password" type="password" class="w-100"
                          placeholder="Sua senha" required />
                      </div>
                      <div class="field mb-3">
                        <label for="adotante-phone" class="form-label">Telefone</label>
                        <InputText id="adotante-phone" v-model="form.phone" type="text" class="w-100"
                          placeholder="Seu telefone" required />
                      </div>
                      <div class="field mb-3">
                        <label for="document" class="form-label">Documento</label>
                        <InputText id="adotante-document" v-model="form.document" type="text" class="w-100"
                          placeholder="Seu documento" required />
                      </div>
                      <Button label="Cadastrar" type="submit" icon="pi pi-sign-in" class="w-100 p-button-primary"
                        :loading="authStore.loading" />
                    </form>
                  </TabPanel>
                  <TabPanel value="1">
                    <form @submit.prevent="handleRegister(true)">
                      <div class="field mb-3">
                        <label for="doador-name" class="form-label">Nome</label>
                        <InputText id="doador-name" v-model="form.name" type="text" class="w-100"
                          placeholder="Nome da instituição" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-email" class="form-label">Email</label>
                        <InputText id="doador-email" v-model="form.email" type="email" class="w-100"
                          placeholder="Email da instituição" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-password" class="form-label">Senha</label>
                        <InputText id="doador-password" v-model="form.password" type="password" class="w-100"
                          placeholder="Senha da instituição" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-phone" class="form-label">Telefone</label>
                        <InputText id="doador-phone" v-model="form.phone" type="text" class="w-100"
                          placeholder="Telefone da instituição" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-document" class="form-label">Documento</label>
                        <InputText id="doador-document" v-model="form.document" type="text" class="w-100"
                          placeholder="Documento da instituição" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-type" class="form-label">Tipo de Instituição</label>
                        <Select id="doador-type" v-model="form.type" :options="typeOptions" optionLabel="label"
                          optionValue="value" placeholder="Selecione o tipo" class="w-100" required />
                      </div>
                      <div class="field mb-3">
                        <label for="doador-documentType" class="form-label">Tipo de Documento</label>
                        <Select id="doador-documentType" v-model="form.documentType" :options="documentTypeOptions"
                          optionLabel="label" optionValue="value" placeholder="Selecione o tipo de documento"
                          class="w-100" required />

                      </div>
                      <Button label="Cadastrar" type="submit" icon="pi pi-sign-in" class="w-100 p-button-primary"
                        :loading="authStore.loading" />
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </template>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.back {
  background: linear-gradient(rgba(40, 94, 97, 0.8), rgba(40, 94, 97, 0.9)),
    url("/login-background.jpg") no-repeat center center;
  background-size: cover;
}

:deep(.p-tablist-tab-list) {
  justify-content: center;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest } from '@/types/auth.type'

const router = useRouter()
const authStore = useAuthStore()

const typeOptions = [
  { label: 'ONG', value: 'ong' },
  { label: 'Protetor', value: 'protector' }
]

const documentTypeOptions = [
  { label: 'CPF', value: 'cpf' },
  { label: 'CNPJ', value: 'cnpj' }
]

const form = ref<RegisterRequest>({
  isOrganization: false,
  name: '',
  email: '',
  password: '',
  phone: '',
  document: '',
  type: '',
  documentType: '',
})

const handleRegister = async (isOrganization: boolean) => {
  form.value.isOrganization = isOrganization
  try {
    await authStore.register(form.value)
    router.push('/')
  } catch (error) {
    alert('Erro ao cadastrar')
  }
}
</script>
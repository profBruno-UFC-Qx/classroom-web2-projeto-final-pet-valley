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
                                <h4 class="mt-2">Cadastrar Endereço</h4>
                            </div>
                        </template>

                        <template #content>
                            <form @submit.prevent="handleCreateAddress">
                                <div class="field mb-3">
                                    <label class="form-label">CEP</label>
                                    <InputText v-model="form.cep" type="number" class="w-100" placeholder="CEP"
                                        required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Rua</label>
                                    <InputText v-model="form.street" type="text" class="w-100" placeholder="Rua"
                                        required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Bairro</label>
                                    <InputText v-model="form.neighborhood" type="text" class="w-100"
                                        placeholder="Bairro" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Cidade</label>
                                    <InputText v-model="form.city" type="text" class="w-100" placeholder="Cidade"
                                        required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Estado</label>
                                    <InputText v-model="form.state" type="text" class="w-100" placeholder="UF"
                                        required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Número</label>
                                    <InputText v-model="form.houseNumber" type="number" class="w-100"
                                        placeholder="Número" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Complemento</label>
                                    <InputText v-model="form.complement" type="text" class="w-100"
                                        placeholder="Opcional" />
                                </div>

                                <Button label="Salvar Endereço" type="submit" icon="pi pi-check"
                                    class="w-100 p-button-primary" :loading="addressStore.loading" />
                            </form>
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
        url("/address-background.jpg") no-repeat center center;
    background-size: cover;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAddressStore } from '@/stores/addressStore'
import type { CreateAddressDTO } from '@/types/address'

const router = useRouter()
const addressStore = useAddressStore()

const form = ref<CreateAddressDTO>({
    ownerId: '', // backend normalmente ignora ou pega do token
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    houseNumber: '',
    complement: ''
})

const handleCreateAddress = async () => {
    try {
        await addressStore.createAddress(form.value)
        router.push('/dashboard') // ajuste conforme sua rota
    } catch (error) {
        alert('Erro ao cadastrar endereço')
    }
}
</script>

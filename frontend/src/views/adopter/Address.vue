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
                                <h4 class="mt-2">
                                    {{ isEdited ? 'Editar Endereço' : 'Cadastrar Endereço' }}
                                </h4>
                            </div>
                        </template>

                        <template #content>
                            <form @submit.prevent="handleSubmit">
                                <div class="field mb-3">
                                    <label class="form-label">CEP</label>
                                    <InputText v-model="form.cep" type="number" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Rua</label>
                                    <InputText v-model="form.street" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Bairro</label>
                                    <InputText v-model="form.neighborhood" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Cidade</label>
                                    <InputText v-model="form.city" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Estado</label>
                                    <InputText v-model="form.state" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Número</label>
                                    <InputText v-model="form.houseNumber" type="number" class="w-100" required />
                                </div>

                                <div class="field mb-3">
                                    <label class="form-label">Complemento</label>
                                    <InputText v-model="form.complement" class="w-100" />
                                </div>

                                <Button :label="isEdited ? 'Editar Endereço' : 'Salvar Endereço'" type="submit"
                                    class="w-100" :loading="addressStore.loading" />
                            </form>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAddressStore } from '@/stores/addressStore'
import type { CreateAddressDTO } from '@/types/address'

const addressStore = useAddressStore()
const isEdited = ref(false)

const form = ref<CreateAddressDTO>({
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    houseNumber: '',
    complement: ''
})

onMounted(async () => {
    const hasAddress = await addressStore.checkHasAddress()

    if (hasAddress) {
        const address = await addressStore.fetchMyAddress()
        isEdited.value = true

        form.value = {
            cep: address.cep,
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            houseNumber: address.houseNumber,
            complement: address.complement ?? ''
        }
    }
})

const handleSubmit = async () => {
    try {
        if (isEdited.value) {
            await addressStore.updateAddress(form.value)
        } else {
            await addressStore.createAddress(form.value)
        }
        window.location.reload();
    } catch {
        alert('Erro ao salvar endereço')
    }
}
</script>

<style scoped>
.back {
    background: linear-gradient(rgba(40, 94, 97, 0.8), rgba(40, 94, 97, 0.9)),
        url("/address-background.jpg") no-repeat center center;
    background-size: cover;
}
</style>

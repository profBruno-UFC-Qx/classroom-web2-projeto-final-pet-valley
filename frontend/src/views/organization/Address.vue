<template>
    <Sidebar />

    <main class="page-content">
        <div class="form-container">
            <h4 class="title">
                {{ isEdited ? 'Editar Endereço' : 'Cadastrar Endereço' }}
            </h4>

            <form @submit.prevent="handleSubmit" class="address-form">
                <div class="field">
                    <label>CEP</label>
                    <InputText v-model="form.cep" type="number" />
                </div>

                <div class="field">
                    <label>Rua</label>
                    <InputText v-model="form.street" />
                </div>

                <div class="field">
                    <label>Bairro</label>
                    <InputText v-model="form.neighborhood" />
                </div>

                <div class="field">
                    <label>Cidade</label>
                    <InputText v-model="form.city" />
                </div>

                <div class="field">
                    <label>Estado</label>
                    <InputText v-model="form.state" />
                </div>

                <div class="field">
                    <label>Número</label>
                    <InputText v-model="form.houseNumber" type="number" />
                </div>

                <div class="field">
                    <label>Complemento</label>
                    <InputText v-model="form.complement" />
                </div>

                <Button :label="isEdited ? 'Editar Endereço' : 'Salvar Endereço'" type="submit" class="submit-btn"
                    :loading="addressStore.loading" />
            </form>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
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
.page-content {
    margin-left: 260px;
    /* sidebar */
    padding: 3rem;
    background-color: var(--surface-ground);
}

.form-container {
    max-width: 1100px;
    /* controla largura máxima */
    margin: 0 auto;
    /* centraliza */
    width: 100%;
}

.title {
    text-align: center;
    margin-bottom: 2rem;
}

.address-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 2 colunas */
    gap: 1.5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.address-form .p-inputtext {
    width: 100%;
}

.submit-btn {
    grid-column: span 2;
    /* botão ocupa a linha inteira */
    margin-top: 1rem;
}
</style>

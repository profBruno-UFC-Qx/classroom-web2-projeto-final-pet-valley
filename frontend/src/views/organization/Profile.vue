<template>
    <Sidebar />

    <main class="page-content">
        <router-view />
        <Card class="profile-card">
            <template #content>
                <div class="forms-wrapper">
                    <!-- PERFIL -->
                    <div class="form-section">
                        <h3>Dados do Perfil</h3>

                        <form @submit.prevent="updateProfile">
                            <div class="field">
                                <label>Nome</label>
                                <InputText v-model="organizationForm.name" />
                            </div>

                            <div class="field">
                                <label>Documento</label>
                                <InputText v-model="organizationForm.document" />
                            </div>

                            <div class="field">
                                <label>Telefone</label>
                                <InputText v-model="organizationForm.phone" />
                            </div>

                            <div class="field">
                                <label>Email</label>
                                <InputText v-model="organizationForm.email" />
                            </div>

                            <Button label="Salvar Perfil" type="submit" class="btn-primary w-100" />
                        </form>
                    </div>

                    <Divider layout="vertical" />

                    <!-- SENHA -->
                    <div class="form-section">
                        <h3>Alterar Senha</h3>

                        <form @submit.prevent="changePassword">
                            <div class="field">
                                <label>Nova senha</label>
                                <Password v-model="newPassword" toggleMask :feedback="false" class="password-full" />
                            </div>

                            <div class="field">
                                <label>Confirmar senha</label>
                                <Password v-model="confirmPassword" toggleMask :feedback="false"
                                    class="password-full" />
                            </div>

                            <Button label="Alterar Senha" type="submit" class="btn-secondary w-100" />
                        </form>
                    </div>
                </div>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import { onMounted, ref } from 'vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { Organization, OrganizationUpdateDTO } from '@/types/organization.type'

const organizationStore = useOrganizationStore()
const organization = ref<Organization | null>(null);

const organizationForm = ref<OrganizationUpdateDTO>({
    name: "",
    document: "",
    phone: "",
    email: "",
})
const newPassword = ref<string>("")
const confirmPassword = ref<string>("")

onMounted(() => {
    loadOrganizationData()
});

const loadOrganizationData = async () => {
    const organizationData = await organizationStore.fetchOrganizationByToken()
    organization.value = organizationData;
    organizationForm.value = {
        name: organizationData.name,
        document: organizationData.document,
        phone: organizationData.phone,
        email: organizationData.email,
    }
}

const updateProfile = async () => {
    try {
        await organizationStore.updateOrganization(organization.value?.id || "", organizationForm.value)
        alert("Perfil atualizado com sucesso!")
    } catch (error) {
        alert("Erro ao atualizar perfil.")
    }
}

const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        alert("As senhas não coincidem.")
        return
    }
    try {
        const body = {
            newPassword: newPassword.value
        }
        await organizationStore.updatePassword(organization.value?.id || "", body);
        alert("Senha atualizada com sucesso!")
        newPassword.value = ""
        confirmPassword.value = ""
    } catch (error) {
        alert("Erro ao atualizar senha.")
    }
}
</script>

<style scoped>
.page-content {
    background-color: var(--surface-ground) !important;
    margin-left: 260px;
    /* mesma largura da sidebar */
    padding: 2rem;
}

.page-container {
    min-height: calc(100vh - 140px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.profile-card {
    width: 100%;
    padding: 32px;
}

.forms-wrapper {
    display: flex;
    align-items: stretch;
    gap: 32px;
}

.form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-section h3 {
    margin-bottom: 24px;
}

.form-section form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-weight: 500;
}

.field .p-inputtext,
.field .p-password,
.field input {
    width: 100%;
}

.btn-primary {
    background-color: #e8741e;
    border: none;
}

.btn-secondary {
    background-color: #2f9c95;
    border: none;
}

:deep(.p-password-input) {
    width: 100% !important;
}

@media (max-width: 900px) {
    .forms-wrapper {
        flex-direction: column;
    }

    .p-divider-vertical {
        display: none;
    }
}
</style>

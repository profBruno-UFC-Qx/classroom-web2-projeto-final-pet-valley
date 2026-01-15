<template>
    <Sidebar />

    <main class="page-content">
        <div class="card">
            <div class="actions-bar">
                <!-- Esquerda -->
                <div class="actions-left">
                    <Button label="Nova Organização" icon="pi pi-plus" class="p-button-primary"
                        @click="openNewDialog()" />
                </div>

                <!-- Centro -->
                <div class="actions-center">
                    <div class="filter-group">
                        <label>Nome</label>
                        <InputText v-model="filters.name" placeholder="Buscar por nome" @input="handleFilter" />
                    </div>

                    <div class="filter-group">
                        <label>Email</label>
                        <InputText v-model="filters.email" placeholder="Buscar por email" @input="handleFilter" />
                    </div>

                    <div class="filter-group">
                        <label>Documento</label>
                        <InputText v-model="filters.document" placeholder="CPF / CNPJ" @input="handleFilter" />
                    </div>
                </div>

                <!-- Direita -->
                <div class="actions-right">
                    <button icon="pi pi-trash" class="btn-delete" @click="clearFilters">
                        <div>
                            <i class="pi pi-trash"></i> Limpar Filtros
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="organizationStore.loading" class="state">
            <i class="pi pi-spin pi-spinner"></i>
            <p>Carregando organizações...</p>
        </div>

        <!-- Error -->
        <div v-else-if="organizationStore.error" class="state error">
            {{ organizationStore.error }}
        </div>

        <!-- Tabela -->
        <div v-else class="table-wrapper">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Documento</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="org in organizationStore.organizations" :key="org.id">
                        <td>{{ org.name }}</td>
                        <td>{{ org.email }}</td>
                        <td>{{ org.document }}</td>
                        <td>
                            <div class="btn-group">

                                <button @click="openEditDialog(org)" class="btn-table-rounded"
                                    style="--btn-border-color: #319795;">
                                    <i class="pi pi-pencil"></i>
                                </button>

                                <button @click="openDeleteDialog(org)" class="btn-table-rounded"
                                    style="--btn-border-color: #FF0000;">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="organizationStore.organizations.length === 0">
                        <td colspan="4" class="empty">
                            Nenhuma organização encontrada
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="pagination">
            <Button icon="pi pi-chevron-left" class="p-button-outlined" :disabled="page === 1"
                @click="setPage(page - 1)" />

            <span>Página {{ page }} de {{ totalPages }}</span>

            <Button icon="pi pi-chevron-right" class="p-button-outlined" :disabled="page === totalPages"
                @click="setPage(page + 1)" />
        </div>

        <!-- Criar Modal -->
        <Dialog v-model:visible="visible" modal :closable="false" header="Nova Organização" style="width: 25rem">
            <button class="dialog-close" @click="visible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="createOrganization()">
                <div class="field mb-3">
                    <label for="doador-name" class="form-label">Nome</label>
                    <InputText id="doador-name" v-model="orgForm.name" type="text" class="w-100"
                        placeholder="Nome da instituição" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-email" class="form-label">Email</label>
                    <InputText id="doador-email" v-model="orgForm.email" type="email" class="w-100"
                        placeholder="Email da instituição" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-password" class="form-label">Senha</label>
                    <InputText id="doador-password" v-model="orgForm.password" type="password" class="w-100"
                        placeholder="Senha da instituição" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-phone" class="form-label">Telefone</label>
                    <InputText id="doador-phone" v-model="orgForm.phone" type="text" class="w-100"
                        placeholder="Telefone da instituição" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-document" class="form-label">Documento</label>
                    <InputText id="doador-document" v-model="orgForm.document" type="text" class="w-100"
                        placeholder="Documento da instituição" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-type" class="form-label">Tipo de Instituição</label>
                    <Select id="doador-type" v-model="orgForm.type" :options="typeOptions" optionLabel="label"
                        optionValue="value" placeholder="Selecione o tipo" class="w-100" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-documentType" class="form-label">Tipo de Documento</label>
                    <Select id="doador-documentType" v-model="orgForm.documentType" :options="documentTypeOptions"
                        optionLabel="label" optionValue="value" placeholder="Selecione o tipo de documento"
                        class="w-100" required />

                </div>
                <Button label="Cadastrar" type="submit" icon="pi pi-sign-in" class="w-100 p-button-primary"
                    :loading="organizationStore.loading" />
            </form>
        </Dialog>

        <!-- Editar Modal -->
        <Dialog v-model:visible="editVisible" modal :closable="false" header="Editar Organização" style="width: 25rem">
            <button class="dialog-close" @click="editVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="updateOrganization()">
                <div class="field mb-3">
                    <label for="doador-name" class="form-label">Nome</label>
                    <InputText id="doador-name" v-model="updateOrganizationForm.name" type="text" class="w-100"
                        placeholder="Nome completo" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-email" class="form-label">Email</label>
                    <InputText id="doador-email" v-model="updateOrganizationForm.email" type="email" class="w-100"
                        placeholder="Email" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-phone" class="form-label">Telefone</label>
                    <InputText id="doador-phone" v-model="updateOrganizationForm.phone" type="text" class="w-100"
                        placeholder="Telefone" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-document" class="form-label">Documento</label>
                    <InputText id="doador-document" v-model="updateOrganizationForm.document" type="text" class="w-100"
                        placeholder="Documento" required />
                </div>
                <Button label="Atualizar" type="submit" class="w-100 p-button-primary"
                    :loading="organizationStore.loading" />
            </form>
        </Dialog>

        <!-- Deletar Modal -->
        <Dialog v-model:visible="deleteVisible" modal :closable="false" header="Deletar Organização"
            style="width: 25rem">
            <button class="dialog-close" @click="deleteVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <div class="mb-4">
                Tem certeza que deseja deletar esta organização?
            </div>
            <div class="btn-group" style="justify-content: center;">
                <Button label="Deletar" @click="deleteOrganization()" :loading="organizationStore.loading" />
                <Button label="Cancelar" severity="secondary" @click="deleteVisible = false" />
            </div>
        </Dialog>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import type { OrganizationCreateDTO, OrganizationUpdateDTO } from '@/types/organization.type'
import { useOrganizationStore } from '@/stores/organizationStore'

const organizationStore = useOrganizationStore()

const visible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentOrgId = ref<string | null>(null);

const page = ref(1)
const limit = ref(10)

const filters = ref({
    name: '',
    email: '',
    document: ''
});

const orgForm = ref<OrganizationCreateDTO>({
    name: '',
    type: "ong",
    document: '',
    documentType: "cnpj",
    phone: '',
    email: '',
    password: '',
});

const updateOrganizationForm = ref<OrganizationUpdateDTO>({
    name: '',
    document: '',
    phone: '',
    email: '',
});

const typeOptions = [
    { label: 'ONG', value: 'ong' },
    { label: 'Protetor', value: 'protector' }
]

const documentTypeOptions = [
    { label: 'CPF', value: 'cpf' },
    { label: 'CNPJ', value: 'cnpj' }
]

const createOrganization = async () => {
    try {
        await organizationStore.createOrganization(orgForm.value);
        visible.value = false;
    } catch (error) {
        alert('Erro ao cadastrar')
    }
}

const updateOrganization = async () => {
    try {
        await organizationStore.updateOrganization(currentOrgId.value!, updateOrganizationForm.value);
        editVisible.value = false;
    } catch (error) {
        alert('Erro ao atualizar')
    }
}

const deleteOrganization = async () => {
    try {
        await organizationStore.deleteOrganization(currentOrgId.value!);
        deleteVisible.value = false;
    } catch (error) {
        alert('Erro ao deletar')
    }
}

function openNewDialog() {
    orgForm.value = {
        name: '',
        type: "ong",
        document: '',
        documentType: "cnpj",
        phone: '',
        email: '',
        password: '',
    };
    visible.value = true;
}

function openEditDialog(org: any) {
    updateOrganizationForm.value = { ...org };
    currentOrgId.value = org.id;
    editVisible.value = true;
}

function openDeleteDialog(org: any) {
    currentOrgId.value = org.id;
    deleteVisible.value = true;
}

// Debounce
let timeout: number | undefined
function handleFilter() {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
        page.value = 1
        fetchOrgs()
    }, 500)
}

function clearFilters() {
    filters.value = {
        name: '',
        email: '',
        document: ''
    }
    page.value = 1
    fetchOrgs()
}

function fetchOrgs() {
    organizationStore.fetchOrganizations({
        page: page.value,
        limit: limit.value,
        filters: {
            ...filters.value
        }
    })
}

function setPage(newPage: number) {
    page.value = newPage
    fetchOrgs()
}

const totalPages = computed(() =>
    Math.ceil(organizationStore.total / limit.value)
)

onMounted(() => {
    fetchOrgs()
})
</script>


<style scoped>
.dialog-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
}

.page-content {
    margin-left: 260px;
    padding: 2rem;
}

:deep(.p-button-outlined) {
    color: #fff !important;
}

.btn-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.actions-bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

/* esquerda / centro / direita */
.actions-left,
.actions-right {
    display: flex;
    align-items: center;
}

.actions-center {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
}

/* filtros */
.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 200px;
}

.btn-delete {
    padding: 8px 12px;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    background: transparent;
    border: 2px solid var(--accent);
    border-radius: 6px;
    color: var(--accent);

    transition:
        background-color 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease;
}

.btn-delete:hover {
    background-color: var(--accent);
    color: var(--support);
}


.table-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th,
.users-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.users-table th {
    text-align: left;
    background: #f8f9fa;
    font-weight: 600;
}

.role-badge {
    padding: 4px 10px;
    border-radius: 12px;
    background: #eef;
    font-size: 0.8rem;
    font-weight: 600;
}

.empty {
    text-align: center;
    padding: 2rem;
    color: #999;
}

.state {
    text-align: center;
    padding: 3rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 1.5rem;
}
</style>

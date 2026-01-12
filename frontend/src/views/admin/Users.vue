<template>
    <Sidebar />

    <main class="page-content">
        <div class="card">
            <div class="actions-bar">
                <!-- Esquerda -->
                <div class="actions-left">
                    <Button label="Novo Usuário" icon="pi pi-plus" class="p-button-primary" @click="openNewDialog()" />
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
        <div v-if="userStore.loading" class="state">
            <i class="pi pi-spin pi-spinner"></i>
            <p>Carregando usuários...</p>
        </div>

        <!-- Error -->
        <div v-else-if="userStore.error" class="state error">
            {{ userStore.error }}
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
                    <tr v-for="user in userStore.users" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.document }}</td>
                        <td>
                            <div class="btn-group">

                                <button @click="openEditDialog(user)" class="btn-table-rounded"
                                    style="--btn-border-color: #319795;">
                                    <i class="pi pi-pencil"></i>
                                </button>

                                <button @click="openDeleteDialog(user)" class="btn-table-rounded"
                                    style="--btn-border-color: #FF0000;">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="userStore.users.length === 0">
                        <td colspan="4" class="empty">
                            Nenhum usuário encontrado
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
        <Dialog v-model:visible="visible" modal :closable="false" header="Novo Usuário" style="width: 25rem">
            <button class="dialog-close" @click="visible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="createUser()">
                <div class="field mb-3">
                    <label for="doador-name" class="form-label">Nome</label>
                    <InputText id="doador-name" v-model="userForm.name" type="text" class="w-100"
                        placeholder="Nome completo" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-email" class="form-label">Email</label>
                    <InputText id="doador-email" v-model="userForm.email" type="email" class="w-100" placeholder="Email"
                        required />
                </div>
                <div class="field mb-3">
                    <label for="doador-password" class="form-label">Senha</label>
                    <InputText id="doador-password" v-model="userForm.password" type="text" class="w-100"
                        placeholder="Senha" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-phone" class="form-label">Telefone</label>
                    <InputText id="doador-phone" v-model="userForm.phone" type="text" class="w-100"
                        placeholder="Telefone" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-document" class="form-label">Documento</label>
                    <InputText id="doador-document" v-model="userForm.document" type="text" class="w-100"
                        placeholder="Documento" required />
                </div>
                <Button label="Cadastrar" type="submit" class="w-100 p-button-primary" :loading="userStore.loading" />
            </form>
        </Dialog>

        <!-- Editar Modal -->
        <Dialog v-model:visible="editVisible" modal :closable="false" header="Editar Usuário" style="width: 25rem">
            <button class="dialog-close" @click="editVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="updateUser()">
                <div class="field mb-3">
                    <label for="doador-name" class="form-label">Nome</label>
                    <InputText id="doador-name" v-model="updateUserForm.name" type="text" class="w-100"
                        placeholder="Nome completo" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-email" class="form-label">Email</label>
                    <InputText id="doador-email" v-model="updateUserForm.email" type="email" class="w-100"
                        placeholder="Email" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-phone" class="form-label">Telefone</label>
                    <InputText id="doador-phone" v-model="updateUserForm.phone" type="text" class="w-100"
                        placeholder="Telefone" required />
                </div>
                <div class="field mb-3">
                    <label for="doador-document" class="form-label">Documento</label>
                    <InputText id="doador-document" v-model="updateUserForm.document" type="text" class="w-100"
                        placeholder="Documento" required />
                </div>
                <Button label="Atualizar" type="submit" class="w-100 p-button-primary" :loading="userStore.loading" />
            </form>
        </Dialog>

        <!-- Deletar Modal -->
        <Dialog v-model:visible="deleteVisible" modal :closable="false" header="Deletar Usuário" style="width: 25rem">
            <button class="dialog-close" @click="deleteVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <div class="mb-4">
                Tem certeza que deseja deletar este usuário?
            </div>
            <div class="btn-group" style="justify-content: center;">
                <Button label="Deletar" @click="deleteUser()" :loading="userStore.loading" />
                <Button label="Cancelar" severity="secondary" @click="deleteVisible = false" />
            </div>
        </Dialog>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useUserStore } from '@/stores/userStore'
import type { UserCreateDTO, UserUpdateDTO } from '@/types/user.type'

const userStore = useUserStore()
const visible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentUserId = ref<string | null>(null);

const page = ref(1)
const limit = ref(10)

const filters = ref({
    name: '',
    email: '',
    document: ''
});

const userForm = ref<UserCreateDTO>({
    name: '',
    document: '',
    phone: '',
    email: '',
    password: '',
    role: 'adopter',
});

const updateUserForm = ref<UserUpdateDTO>({
    name: '',
    document: '',
    phone: '',
    email: '',
});

const createUser = async () => {
    try {
        await userStore.createAdopterUser(userForm.value);
        visible.value = false;
    } catch (error) {
        alert('Erro ao cadastrar')
    }
}

const updateUser = async () => {
    try {
        await userStore.updateUser(currentUserId.value!, updateUserForm.value);
        editVisible.value = false;
    } catch (error) {
        alert('Erro ao atualizar')
    }
}

const deleteUser = async () => {
    try {
        await userStore.deleteUser(currentUserId.value!);
        deleteVisible.value = false;
    } catch (error) {
        alert('Erro ao deletar')
    }
}

function openNewDialog() {
    userForm.value = {
        name: '',
        document: '',
        phone: '',
        email: '',
        password: '',
        role: 'adopter',
    };
    visible.value = true;
}

function openEditDialog(user: any) {
    updateUserForm.value = { ...user };
    currentUserId.value = user.id;
    editVisible.value = true;
}

function openDeleteDialog(user: any) {
    currentUserId.value = user.id;
    deleteVisible.value = true;
}

// Debounce
let timeout: number | undefined
function handleFilter() {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
        page.value = 1
        fetchUsers()
    }, 500)
}

function clearFilters() {
    filters.value = {
        name: '',
        email: '',
        document: ''
    }
    page.value = 1
    fetchUsers()
}

function fetchUsers() {
    userStore.fetchUsers({
        page: page.value,
        limit: limit.value,
        filters: {
            ...filters.value
        }
    })
}

function setPage(newPage: number) {
    page.value = newPage
    fetchUsers()
}

const totalPages = computed(() =>
    Math.ceil(userStore.total / limit.value)
)

onMounted(() => {
    fetchUsers()
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

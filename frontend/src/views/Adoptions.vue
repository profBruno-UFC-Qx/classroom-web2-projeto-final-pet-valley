<template>
    <!-- Organizations -->
    <div v-if="isOrganization">
        <Sidebar />
        <main class="page-content">
            <!-- Loading -->
            <div v-if="adoptionsStore.loading" class="state">
                <i class="pi pi-spin pi-spinner"></i>
                <p>Carregando adoções...</p>
            </div>

            <!-- Error -->
            <div v-else-if="adoptionsStore.error" class="state error">
                {{ adoptionsStore.error }}
            </div>

            <!-- Tabela -->
            <div v-else class="table-wrapper">
                <table class="adoptions-table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Nome</th>
                            <th>Raça</th>
                            <th>Adotante</th>
                            <th>Status</th>
                            <th>Passo</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="adoption in adoptionsStore.adoptions" :key="adoption.id"
                            :class="{ 'clickable-row': isClickable(adoption.status) }"
                            @keydown.enter.prevent="onRowClick(adoption)" tabindex="0">
                            <td class="animal-image">
                                <Image v-if="adoption.animal?.images?.[0]" :src="adoption.animal.images[0]"
                                    :alt="adoption.animal.name" width="45" preview />
                            </td>
                            <td @click="onRowClick(adoption)">{{ adoption.animal?.name || '-' }}</td>
                            <td @click="onRowClick(adoption)">{{ adoption.animal?.breed || '-' }}</td>
                            <td @click="onRowClick(adoption)">{{ adoption.adopterUser?.name || '-' }}</td>
                            <td @click="onRowClick(adoption)">
                                <span class="status-badge" :class="`status-${adoption.status}`">
                                    {{ getStatusLabel(adoption.status) }}
                                </span>
                            </td>
                            <td @click="onRowClick(adoption)">{{ adoption.currentStep }}/5</td>
                            <td @click="onRowClick(adoption)">{{ formatDate(adoption.createdAt) }}</td>
                        </tr>

                        <tr v-if="adoptionsStore.adoptions.length === 0">
                            <td colspan="7" class="empty">
                                {{ isOrganization ? 'Nenhuma adoção encontrada' : 'Você ainda não tem adoções' }}
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
        </main>
    </div>

    <!-- Adopters -->
    <div v-else>
        <Navbar />
        <div class="user-content">
            <!-- Loading -->
            <div v-if="adoptionsStore.loading" class="state">
                <i class="pi pi-spin pi-spinner"></i>
                <p>Carregando suas adoções...</p>
            </div>

            <!-- Error -->
            <div v-else-if="adoptionsStore.error" class="state error">
                {{ adoptionsStore.error }}
            </div>

            <!-- Tabela -->
            <div v-else class="table-wrapper">
                <table class="adoptions-table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Nome</th>
                            <th>Raça</th>
                            <th>Organização</th>
                            <th>Status</th>
                            <th>Passo</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="adoption in adoptionsStore.adoptions" :key="adoption.id"
                            :class="{ 'clickable-row': isClickable(adoption.status) }"
                            @keydown.enter.prevent="onRowClick(adoption)" tabindex="0">
                            <td class="animal-image">
                                <Image v-if="adoption.animal?.images?.[0]" :src="adoption.animal.images[0]"
                                    :alt="adoption.animal.name" width="45" preview />
                            </td>
                            <td @click="onRowClick(adoption)">{{ adoption.animal?.name || '-' }}</td>
                            <td @click="onRowClick(adoption)">{{ adoption.animal?.breed || '-' }}</td>
                            <td @click="onRowClick(adoption)">{{ adoption.organization?.name || '-' }}</td>
                            <td @click="onRowClick(adoption)">
                                <span class="status-badge" :class="`status-${adoption.status}`">
                                    {{ getStatusLabel(adoption.status) }}
                                </span>
                            </td>
                            <td @click="onRowClick(adoption)">{{ adoption.currentStep }}/5</td>
                            <td @click="onRowClick(adoption)">{{ formatDate(adoption.createdAt) }}</td>
                        </tr>

                        <tr v-if="adoptionsStore.adoptions.length === 0">
                            <td colspan="7" class="empty">
                                Você ainda não tem adoções
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
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAdoptionsStore } from '@/stores/adoptionsStore'
import { useAuthStore } from '@/stores/authStore'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(
    () => route.fullPath,
    () => {
        fetchAdoptions()
    }
);

const router = useRouter()
const adoptionsStore = useAdoptionsStore()
const authStore = useAuthStore()

const page = ref(1)
const limit = ref(10)
const isOrganization = ref(false)

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
}

function getStatusLabel(status: string): string {
    const s = String(status).toLowerCase()
    const statusMap: { [key: string]: string } = {
        active: 'Ativo',
        pending: 'Pendente',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        canceled: 'Cancelado'
    }
    return statusMap[s] || status
}

function isClickable(status: string): boolean {
    const s = String(status).toLowerCase()
    return s === 'active' || s === 'pending' || s === 'completed'
}

function onRowClick(adoption: any) {
    const s = String(adoption.status).toLowerCase()
    if (s === 'cancelled' || s === 'canceled') {
        alert('Não é possível continuar: adoção cancelada.')
        return
    }

    if (isClickable(s)) {
        router.push({ path: `/adocoes/${adoption.id}` })
    }
}

function fetchAdoptions() {
    if (isOrganization.value) {
        const orgId = authStore.user?.id
        if (orgId) {
            adoptionsStore.getOrganizationAdoptions(orgId, page.value, limit.value)
        }
    } else {
        const userId = authStore.user?.id
        if (userId) {
            adoptionsStore.getUserAdoptions(userId, page.value, limit.value)
        }
    }
}

function setPage(newPage: number) {
    page.value = newPage
    fetchAdoptions()
}

const totalPages = computed(() =>
    Math.ceil(adoptionsStore.total / limit.value)
)

onMounted(() => {
    // Verificar se é organização ou adotante
    if (authStore.user?.role === 'organization') {
        isOrganization.value = true
    } else {
        isOrganization.value = false
    }

    fetchAdoptions()
})
</script>

<style scoped>
.page-content {
    margin-left: 260px;
    padding: 3rem;
    background-color: var(--surface-ground);
}

.user-content {
    padding: 3rem;
    min-height: 60vh;
}

:deep(.p-button-outlined) {
    color: #fff !important;
}

.table-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.adoptions-table {
    width: 100%;
    border-collapse: collapse;
}

.adoptions-table th,
.adoptions-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.adoptions-table th {
    text-align: left;
    background: #f8f9fa;
    font-weight: 600;
}

.animal-image {
    width: 60px;
    padding: 8px;
}

.animal-image img {
    width: 100%;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-active {
    background: #e6f7ff;
    color: #0066cc;
}

.status-pending {
    background: #fff7e6;
    color: #b26b00;
}

.status-completed {
    background: #e6ffe6;
    color: #009900;
}

.status-cancelled,
.status-canceled {
    background: #ffe6e6;
    color: #cc0000;
}

/* Hover / clickable row */
.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background: #f5fbff;
}

/* Make keyboard-focus visible for accessibility */
.adoptions-table tr[tabindex]:focus {
    outline: 2px solid rgba(0, 110, 220, 0.18);
    background: #f5fbff;
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

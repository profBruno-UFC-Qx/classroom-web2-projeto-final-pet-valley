<template>
    <Sidebar />

    <main class="page-content">
        <div class="card">
            <div class="actions-bar">
                <!-- Esquerda -->
                <div class="actions-left">
                    <Button label="Novo Animal" icon="pi pi-plus" class="p-button-primary" @click="openNewDialog()" />
                </div>

                <!-- Centro -->
                <div class="actions-center">
                    <div class="filter-group">
                        <label>Espécie</label>
                        <Select v-model="filters.species" :options="specieOptions" optionLabel="label"
                            optionValue="value" placeholder="Selecione a espécie" @change="handleFilter" />
                    </div>

                    <div class="filter-group">
                        <label>Raça</label>
                        <InputText v-model="filters.breed" placeholder="Buscar por raça" @input="handleFilter" />
                    </div>

                    <div class="filter-group">
                        <label>Sexo</label>
                        <Select v-model="filters.sex" :options="sexOptions" optionLabel="label" optionValue="value"
                            placeholder="Selecione o sexo" @change="handleFilter" />
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
        <div v-if="animalStore.loading" class="state">
            <i class="pi pi-spin pi-spinner"></i>
            <p>Carregando animais...</p>
        </div>

        <!-- Error -->
        <div v-else-if="animalStore.error" class="state error">
            {{ animalStore.error }}
        </div>

        <!-- Tabela -->
        <div v-else class="table-wrapper">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Espécie</th>
                        <th>Raça</th>
                        <th>Sexo</th>
                        <th>Idade</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="animal in animalStore.animals" :key="animal.id">
                        <td>{{ animal.name }}</td>
                        <td>{{ animal.species }}</td>
                        <td>{{ animal.breed }}</td>
                        <td>{{ animal.sex }}</td>
                        <td>{{ animal.age }}</td>
                        <td>{{ translateStatus(animal.status) }}</td>
                        <td>
                            <div class="btn-group">

                                <button @click="openEditDialog(animal)" class="btn-table-rounded"
                                    style="--btn-border-color: #319795;">
                                    <i class="pi pi-pencil"></i>
                                </button>

                                <button @click="openDeleteDialog(animal)" class="btn-table-rounded"
                                    style="--btn-border-color: #FF0000;">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="animalStore.animals.length === 0">
                        <td colspan="7" class="empty">
                            Nenhum animal encontrado
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination">
            <Button icon="pi pi-chevron-left" class="p-button-outlined" :disabled="page === 1"
                @click="setPage(page - 1)" />

            <span>Página {{ page }} de {{ totalPages }}</span>

            <Button icon="pi pi-chevron-right" class="p-button-outlined" :disabled="page === totalPages"
                @click="setPage(page + 1)" />
        </div>

        <!-- Criar Modal -->
        <Dialog v-model:visible="visible" modal :closable="false" header="Novo Animal" style="width: 30rem">
            <button class="dialog-close" @click="visible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="createAnimal()">
                <div class="field mb-3">
                    <label for="animal-name" class="form-label">Nome</label>
                    <InputText id="animal-name" v-model="animalForm.name" type="text" class="w-100" placeholder="Nome"
                        required />
                </div>
                <div class="field mb-3">
                    <label for="animal-species" class="form-label">Espécie</label>
                    <Select id="animal-species" v-model="animalForm.species" :options="specieOptions"
                        optionLabel="label" optionValue="value" class="w-100" placeholder="Selecione a espécie"
                        required />
                </div>
                <div class="field mb-3">
                    <label for="animal-breed" class="form-label">Raça</label>
                    <InputText id="animal-breed" v-model="animalForm.breed" type="text" class="w-100" placeholder="Raça"
                        required />
                </div>
                <div class="field mb-3">
                    <label for="animal-sex" class="form-label">Sexo</label>
                    <Select id="animal-sex" v-model="animalForm.sex" :options="sexOptions" optionLabel="label"
                        optionValue="value" class="w-100" placeholder="Selecione o sexo" required />
                </div>
                <div class="field mb-3">
                    <label for="animal-age" class="form-label">Idade</label>
                    <InputNumber id="animal-age" v-model="animalForm.age" class="w-100" placeholder="Idade" required />
                </div>
                <div class="field mb-3">
                    <label for="animal-size" class="form-label">Tamanho (cm)</label>
                    <InputNumber id="animal-size" v-model="animalForm.size" class="w-100"
                        placeholder="Tamanho (ex: 45,5)" mode="decimal" locale="pt-BR" :minFractionDigits="1"
                        :maxFractionDigits="2" :useGrouping="false" required />
                </div>

                <div class="field mb-3">
                    <label for="animal-weight" class="form-label">Peso (kg)</label>
                    <InputNumber id="animal-weight" v-model="animalForm.weight" class="w-100"
                        placeholder="Peso (ex: 12,75 kg)" mode="decimal" locale="pt-BR" :minFractionDigits="2"
                        :maxFractionDigits="2" :min="0" :step="0.01" required />
                </div>
                <div class="field mb-3">
                    <label for="animal-description" class="form-label">Descrição</label>
                    <Textarea id="animal-description" v-model="animalForm.description" class="w-100"
                        placeholder="Descrição" required />
                </div>
                <div class="field mb-3" style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <Checkbox v-model="animalForm.vaccinated" :binary="true" />
                    <label class="form-label">Vacinado</label>
                </div>
                <div class="field mb-3" style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <Checkbox v-model="animalForm.neutered" :binary="true" />
                    <label class="form-label">Castrado</label>
                </div>
                <div class="field mb-3">
                    <label for="animal-specialNeeds" class="form-label">Necessidades Especiais</label>
                    <InputText id="animal-specialNeeds" v-model="animalForm.specialNeeds" type="text" class="w-100"
                        placeholder="Necessidades Especiais" />
                </div>
                <div class="field mb-3">
                    <label for="animal-images" class="form-label">Imagens (máx. 5)</label>
                    <input type="file" id="animal-images" multiple accept="image/*" @change="onFilesChange"
                        class="w-100 p-inputtext" required />
                </div>
                <Button label="Cadastrar" type="submit" class="w-100 p-button-primary" :loading="animalStore.loading" />
            </form>
        </Dialog>

        <!-- Editar Modal -->
        <Dialog v-model:visible="editVisible" modal :closable="false" header="Editar Animal" style="width: 40rem">
            <button class="dialog-close" @click="editVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <form @submit.prevent="updateAnimal()">
                <div class="field mb-3">
                    <label for="animal-name" class="form-label">Nome</label>
                    <InputText id="animal-name" v-model="updateAnimalForm.name" type="text" class="w-100"
                        placeholder="Nome" />
                </div>
                <div class="field mb-3">
                    <label for="animal-species" class="form-label">Espécie</label>
                    <Select id="animal-species" v-model="updateAnimalForm.species" :options="specieOptions"
                        optionLabel="label" optionValue="value" class="w-100" placeholder="Selecione a espécie" />
                </div>
                <div class="field mb-3">
                    <label for="animal-breed" class="form-label">Raça</label>
                    <InputText id="animal-breed" v-model="updateAnimalForm.breed" type="text" class="w-100"
                        placeholder="Raça" />
                </div>
                <div class="field mb-3">
                    <label for="animal-sex" class="form-label">Sexo</label>
                    <Select id="animal-sex" v-model="updateAnimalForm.sex" :options="sexOptions" optionLabel="label"
                        optionValue="value" class="w-100" placeholder="Selecione o sexo" required />
                </div>
                <div class="field mb-3">
                    <label for="animal-age" class="form-label">Idade</label>
                    <InputNumber id="animal-age" v-model="updateAnimalForm.age" class="w-100" placeholder="Idade" />
                </div>
                <div class="field mb-3">
                    <label for="animal-size" class="form-label">Tamanho (cm)</label>
                    <InputNumber id="animal-size" v-model="updateAnimalForm.size" class="w-100"
                        placeholder="Tamanho (ex: 45,5)" mode="decimal" locale="pt-BR" :minFractionDigits="1"
                        :maxFractionDigits="2" :useGrouping="false" />
                </div>
                <div class="field mb-3">
                    <label for="animal-weight" class="form-label">Peso (kg)</label>
                    <InputNumber id="animal-weight" v-model="updateAnimalForm.weight" class="w-100"
                        placeholder="Peso (ex: 12,75 kg)" mode="decimal" locale="pt-BR" :minFractionDigits="2"
                        :maxFractionDigits="2" :min="0" :step="0.01" />
                </div>
                <div class="field mb-3">
                    <label for="animal-description" class="form-label">Descrição</label>
                    <Textarea id="animal-description" v-model="updateAnimalForm.description" class="w-100"
                        placeholder="Descrição" />
                </div>
                <div class="field mb-3">
                    <div class="field mb-3" style="display: flex; align-items: flex-start; gap: 0.5rem;">
                        <Checkbox v-model="updateAnimalForm.vaccinated" :binary="true" />
                        <label class="form-label">Vacinado</label>
                    </div>
                </div>
                <div class="field mb-3">
                    <div class="field mb-3" style="display: flex; align-items: flex-start; gap: 0.5rem;">
                        <label class="form-label">Castrado</label>
                        <Checkbox v-model="updateAnimalForm.neutered" :binary="true" />
                    </div>
                </div>
                <div class="field mb-3">
                    <label for="animal-specialNeeds" class="form-label">Necessidades Especiais</label>
                    <InputText id="animal-specialNeeds" v-model="updateAnimalForm.specialNeeds" type="text"
                        class="w-100" placeholder="Necessidades Especiais" />
                </div>
                <Button label="Atualizar" type="submit" class="w-100 p-button-primary" :loading="animalStore.loading" />
            </form>
        </Dialog>

        <!-- Deletar Modal -->
        <Dialog v-model:visible="deleteVisible" modal :closable="false" header="Deletar Animal" style="width: 25rem">
            <button class="dialog-close" @click="deleteVisible = false">
                <i class="pi pi-times"></i>
            </button>
            <div class="mb-4">
                Tem certeza que deseja deletar este animal?
            </div>
            <div class="btn-group" style="justify-content: center;">
                <Button label="Deletar" @click="deleteAnimal()" :loading="animalStore.loading" />
                <Button label="Cancelar" severity="secondary" @click="deleteVisible = false" />
            </div>
        </Dialog>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAnimalStore } from '@/stores/animalsStore'
import type { AnimalCreateDTO, AnimalUpdateDTO } from '@/types/animals'
import { useOrganizationStore } from '@/stores/organizationStore'

const organizationStore = useOrganizationStore()
const animalStore = useAnimalStore()
const visible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentAnimalId = ref<string | null>(null);

const statusTranslation = {
    available: 'Disponível',
    adopted: 'Adotado',
    pending: 'Pendente',
} as const

const translateStatus = (status: string) => {
    return statusTranslation[status as keyof typeof statusTranslation] || status
}

const page = ref(1)
const limit = ref(10)

const filters = ref({
    species: '',
    breed: '',
    sex: ''
});

const sexOptions = [
    { label: 'Macho', value: 'macho' },
    { label: 'Fêmea', value: 'femea' }
]

const specieOptions = [
    { label: 'Gato', value: 'gato' },
    { label: 'Cachorro', value: 'cachorro' }
]

const animalForm = ref<AnimalCreateDTO>({
    organizationId: '',
    name: '',
    species: '',
    breed: '',
    sex: 'macho',
    age: 0,
    size: 0,
    weight: 0,
    description: '',
    vaccinated: false,
    neutered: false,
    specialNeeds: '',
    status: 'available',
    images: [] as File[]
});

const updateAnimalForm = ref<AnimalUpdateDTO>({
    name: '',
    species: '',
    breed: '',
    sex: 'macho',
    age: 0,
    size: 0,
    weight: 0,
    description: '',
    vaccinated: false,
    neutered: false,
    specialNeeds: ''
});

const createAnimal = async () => {
    try {
        await animalStore.createAnimal(animalForm.value);
        visible.value = false;
    } catch (error) {
        alert('Erro ao cadastrar')
    }
}

const updateAnimal = async () => {
    try {
        await animalStore.updateAnimal(currentAnimalId.value!, updateAnimalForm.value);
        editVisible.value = false;
    } catch (error) {
        alert('Erro ao atualizar')
    }
}

const deleteAnimal = async () => {
    try {
        await animalStore.deleteAnimal(currentAnimalId.value!);
        deleteVisible.value = false;
    } catch (error) {
        alert('Erro ao deletar')
    }
}

// onMounted(async () => {
//     if (organizationStore.organizationOptions.length === 0) {
//         await organizationStore.fetchOrganizationOptions()
//     }
// });

const onFilesChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        animalForm.value.images = Array.from(input.files).slice(0, 5);  // Limita a 5 arquivos
    }
}

function openNewDialog() {
    animalForm.value = {
        organizationId: '',
        name: '',
        species: '',
        breed: '',
        sex: 'macho',
        age: 0,
        size: 0,
        weight: 0,
        description: '',
        vaccinated: false,
        neutered: false,
        specialNeeds: '',
        status: 'available',
        images: []
    };
    visible.value = true;
}

function openEditDialog(animal: any) {
    updateAnimalForm.value = { ...animal };
    currentAnimalId.value = animal.id;
    editVisible.value = true;
}

function openDeleteDialog(animal: any) {
    currentAnimalId.value = animal.id;
    deleteVisible.value = true;
}

// Debounce
let timeout: number | undefined
function handleFilter() {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
        page.value = 1
        fetchAnimals()
    }, 500)
}

function clearFilters() {
    filters.value = {
        species: '',
        breed: '',
        sex: '',
    }
    page.value = 1
    fetchAnimals()
}

function fetchAnimals() {
    animalStore.fetchAnimalsByOrganization({
        page: page.value,
        limit: limit.value,
        ...filters.value
    })
}

function setPage(newPage: number) {
    page.value = newPage
    fetchAnimals()
}

const totalPages = computed(() =>
    Math.ceil(animalStore.total / limit.value)
)

onMounted(() => {
    fetchAnimals()
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

:deep(.p-button-text.p-button-danger) {
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

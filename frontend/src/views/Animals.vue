<template>
  <div class="animals-page">
    <Navbar />

    <section class="animals-section py-5">
      <div class="container">
        <SectionTitle title="Animais para Adoção" text-center />

        <!-- Filtros -->
        <div class="filters-container">
          <div class="filters">
            <div class="filter-group">
              <label class="filter-label">Espécie</label>
              <select v-model="filters.species" @change="handleFilter" class="filter-select">
                <option value="" disabled selected hidden>Selecione uma espécie</option>
                <option value="cachorro">Cachorro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Raça</label>
              <input
                v-model="filters.breed"
                type="text"
                placeholder="Digite a raça"
                class="filter-input"
                @input="handleFilter"
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">Sexo</label>
              <select v-model="filters.sex" @change="handleFilter" class="filter-select">
                <option value="" disabled selected hidden>Selecione o sexo</option>
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Vacinado</label>
              <div class="checkbox-container">
                <input
                  v-model="filters.vaccinated"
                  type="checkbox"
                  id="vaccinated"
                  class="filter-checkbox"
                  @change="handleFilter"
                />
                <label for="vaccinated" class="checkbox-custom"></label>
              </div>
            </div>

            <div class="filter-group button-group">
              <button @click="clearFilters" class="clear-button">Limpar Filtros</button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="animalStore.loading" class="text-center py-5">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p class="mt-2">Carregando animais...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="animalStore.error" class="error alert alert-danger">
          {{ animalStore.error }}
        </div>

        <!-- Animals list -->
        <div v-else class="animals-grid">
          <BaseCard
            v-for="animal in animalStore.animals"
            :key="animal.id"
            class="animal-card"
            hoverable
          >
            <div class="animal-image-container">
              <img :src="animal.images[0]" :alt="animal.name" />
            </div>
            <div class="animal-content">
              <h3>{{ animal.name }}</h3>
              <p>
                {{ animal.species === 'cachorro' ? '🐕' : '🐈' }}
                <strong>{{ animal.breed }}</strong> - {{ animal.age }} anos -
                {{ animal.sex === 'macho' ? 'Macho' : 'Fêmea' }}
              </p>
              <p>Tamanho: {{ animal.size }}cm • Peso: {{ animal.weight }}kg</p>
              <p class="description">{{ animal.description }}</p>
              <div class="animal-actions">
                <Button
                  @click="details(animal.id)"
                  label="Ver Detalhes"
                  class="p-button-primary"
                  :disabled="animal.status !== 'available'"
                />
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- No results -->
        <div
          v-if="!animalStore.loading && !animalStore.error && animalStore.animals.length === 0"
          class="text-center py-5"
        >
          <i class="pi pi-search" style="font-size: 3rem; color: #ccc"></i>
          <h4 class="mt-3">Nenhum animal encontrado</h4>
          <p>Tente ajustar os filtros para ver mais resultados.</p>
        </div>

        <!-- Pagination -->
        <div v-if="animalStore.totalPages > 1" class="pagination">
          <Button
            @click="animalStore.setPage(animalStore.page - 1)"
            :disabled="animalStore.page === 1"
            icon="pi pi-chevron-left"
            class="p-button-outlined"
          />
          <span class="page-info"
            >Página {{ animalStore.page }} de {{ animalStore.totalPages }}</span
          >
          <Button
            @click="animalStore.setPage(animalStore.page + 1)"
            :disabled="animalStore.page === animalStore.totalPages"
            icon="pi pi-chevron-right"
            class="p-button-outlined"
          />
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimalStore } from '@/stores/animalsStore'
import type { AnimalFilters } from '@/types/animals'

// Components
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import BaseCard from '@/components/BaseCard.vue'

// PrimeVue Components (apenas Button mantido)
import Button from 'primevue/button'

const animalStore = useAnimalStore()

const filters = ref<AnimalFilters>({
  species: '',
  breed: undefined,
  sex: '',
  vaccinated: undefined,
  status: 'available', // Sempre filtrar por disponíveis
})

// Debounce para não fazer muitas requisições
let timeoutId: number | undefined
function handleFilter() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    // Garantir que sempre filtre por animais disponíveis
    const filtersToSend = {
      ...filters.value,
      status: 'available',
    }
    animalStore.searchAnimals(filtersToSend)
  }, 500)
}

function clearFilters() {
  filters.value = {
    species: '',
    breed: undefined,
    sex: '',
    vaccinated: undefined,
    status: 'available',
  }
  animalStore.clearFilters()
}

function details(animalId: string) {
  console.log(animalId);
  // Lógica para navegar para a página de detalhes do animal
  // Por exemplo, usando o Vue Router
  // router.push({ name: 'AnimalDetails', params: { id: animalId } })
}

function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    available: 'Disponível',
    adopted: 'Adotado',
    pending: 'Pendente',
  }
  return statusMap[status] || status
}

// Carregar animais quando o componente montar
onMounted(() => {
  animalStore.fetchAnimals({ status: 'available' })
})
</script>

<style scoped>
.animals-section {
  background-color: var(--support);
}

.filters-container {
  margin-bottom: 30px;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  flex: 1;
}

.filter-label {
  font-weight: 600;
  color: var(--accent);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.filter-select,
.filter-input {
  height: 30px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(221, 107, 32, 0.2);
}

/* Estilos para o checkbox customizado */
.checkbox-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
}

.filter-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 16px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.filter-checkbox:checked + .checkbox-custom {
  background-color: var(--primary);
  border-color: var(--primary);
}

.filter-checkbox:checked + .checkbox-custom::after {
  opacity: 1;
}

.filter-checkbox:focus + .checkbox-custom {
  box-shadow: 0 0 0 2px rgba(221, 107, 32, 0.2);
}

.button-group {
  min-width: auto;
  flex: 0 0 auto;
}

.clear-button {
  height: 30px;
  padding: 0 16px;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background: #2a8785;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.animal-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding: 0 !important;
  overflow: hidden;
}

.animal-image-container {
  width: 100%;
  margin: 0;
}

.animal-image-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
  display: block;
}

.animal-content {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.animal-content h3 {
  margin: 0 0 10px 0;
  color: var(--accent);
  font-size: 1.4rem;
}

.animal-content p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.animal-content .description {
  flex-grow: 1;
  font-style: italic;
  color: #888;
  margin-top: 10px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin: 10px 0;
}

.status-badge.available {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status-badge.adopted {
  background-color: #fff3e0;
  color: #ef6c00;
}

.status-badge.pending {
  background-color: #e3f2fd;
  color: #1565c0;
}

.vaccine-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background-color: #e8f5e8;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 0.8rem;
  margin: 5px 0;
}

.vaccine-badge i {
  font-size: 0.9rem;
}

.animal-actions {
  margin-top: 15px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-info {
  font-weight: 500;
  color: var(--accent);
}

.error {
  border-radius: 8px;
  text-align: center;
}

/* Responsividade */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: 100%;
  }

  .checkbox-group {
    justify-content: flex-start;
  }
}
</style>

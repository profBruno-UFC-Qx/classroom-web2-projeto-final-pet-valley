<template>
  <div class="animal-detail-page">
    <Navbar />

    <section class="animal-detail-section py-5">
      <div class="container">
        <!-- Back Button -->
        <router-link to="/animais" class="back-link">
          <i class="pi pi-arrow-left"></i> Voltar para Animais
        </router-link>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p class="mt-2">Carregando detalhes do animal...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error alert alert-danger">
          {{ error }}
        </div>

        <!-- Animal Details -->
        <div v-else-if="animal" class="animal-detail-container">
          <!-- Images Gallery -->
          <div class="images-section">
            <div class="main-image">
              <img :src="animal.images[selectedImageIndex]" :alt="animal.name" />
            </div>
            <div v-if="animal.images.length > 1" class="images-gallery">
              <div
                v-for="(image, index) in animal.images"
                :key="index"
                @click="selectedImageIndex = index"
                class="gallery-item"
                :class="{ active: index === selectedImageIndex }"
              >
                <img :src="image" :alt="`${animal.name} - ${index}`" />
              </div>
            </div>
          </div>

          <!-- Details Section -->
          <div class="details-section">
            <div class="header-info">
              <h1>{{ animal.name }}</h1>
              <div class="status-info">
                <span class="status-badge" :class="animal.status">
                  {{ getStatusLabel(animal.status) }}
                </span>
              </div>
            </div>

            <!-- Quick Info -->
            <div class="quick-info">
              <div class="info-item">
                <span class="label">Espécie</span>
                <span class="value">{{ animal.species === 'cachorro' ? '🐕 Cachorro' : '🐈 Gato' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Raça</span>
                <span class="value">{{ animal.breed }}</span>
              </div>
              <div class="info-item">
                <span class="label">Sexo</span>
                <span class="value">{{ animal.sex === 'macho' ? '♂️ Macho' : '♀️ Fêmea' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Idade</span>
                <span class="value">{{ animal.age }} {{ animal.age === 1 ? 'ano' : 'anos' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Tamanho</span>
                <span class="value">{{ animal.size }}cm</span>
              </div>
              <div class="info-item">
                <span class="label">Peso</span>
                <span class="value">{{ animal.weight }}kg</span>
              </div>
            </div>

            <!-- Description -->
            <div class="description-section">
              <h2>Sobre {{ animal.name }}</h2>
              <p>{{ animal.description }}</p>
            </div>

            <!-- Health Info -->
            <div class="health-section">
              <h2>Informações de Saúde</h2>
              <div class="health-items">
                <div class="health-item" :class="{ active: animal.vaccinated }">
                  <i class="pi" :class="animal.vaccinated ? 'pi-check-circle' : 'pi-times-circle'"></i>
                  <span>{{ animal.vaccinated ? 'Vacinado' : 'Não Vacinado' }}</span>
                </div>
                <div class="health-item" :class="{ active: animal.neutered }">
                  <i class="pi" :class="animal.neutered ? 'pi-check-circle' : 'pi-times-circle'"></i>
                  <span>{{ animal.neutered ? 'Castrado' : 'Não Castrado' }}</span>
                </div>
                <div v-if="animal.specialNeeds" class="health-item special">
                  <i class="pi pi-exclamation-triangle"></i>
                  <span>{{ animal.specialNeeds }}</span>
                </div>
              </div>
            </div>

            <!-- Adoption Button -->
            <div v-if="animal.status === 'available'" class="action-section">
              <Button
                @click="handleAdoption"
                label="Iniciar Processo de Adoção"
                class="p-button-primary adoption-button"
              />
            </div>

            <div v-else class="unavailable-section">
              <p>Este animal não está disponível para adoção no momento.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Animal } from '@/types/animals'
import { getAnimal } from '@/services/animals'

// Components
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from 'primevue/button'

// State
const route = useRoute()
const router = useRouter()
const animal = ref<Animal | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImageIndex = ref(0)

// Methods
const fetchAnimal = async () => {
  try {
    loading.value = true
    error.value = null
    const animalId = route.params.id as string
    animal.value = await getAnimal(animalId)
  } catch (err) {
    error.value = 'Erro ao carregar detalhes do animal. Tente novamente.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    available: 'Disponível',
    adopted: 'Adotado',
    pending: 'Pendente',
  }
  return statusMap[status] || status
}

const handleAdoption = () => {
  alert('Tem que mexer aqui!!!')
  // TODO: Implementar fluxo de adoção
}

// Lifecycle
onMounted(() => {
  fetchAnimal()
})
</script>

<style scoped>
.animal-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.animal-detail-section {
  background-color: var(--support);
  flex: 1;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 30px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--accent);
}

.back-link i {
  font-size: 1rem;
}

.animal-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Images Section */
.images-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: fill;
  display: block;
  border-radius: 12px;
}

.images-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.gallery-item {
  flex: 0 0 80px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.gallery-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.gallery-item:hover {
  border-color: var(--primary);
  transform: scale(1.05);
}

.gallery-item.active {
  border-color: var(--primary);
}

/* Details Section */
.details-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-info h1 {
  color: var(--accent);
  font-size: 2.5rem;
  margin: 0;
}

.status-info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
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

/* Quick Info */
.quick-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid var(--primary);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item .label {
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 1.1rem;
  color: var(--accent);
  font-weight: 600;
}

/* Description */
.description-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.description-section h2 {
  color: var(--accent);
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 15px;
}

.description-section p {
  color: #555;
  line-height: 1.6;
  font-size: 1rem;
}

/* Health Section */
.health-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.health-section h2 {
  color: var(--accent);
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 15px;
}

.health-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #999;
  transition: all 0.2s ease;
}

.health-item.active {
  background: #e8f5e8;
  color: #2e7d32;
}

.health-item.special {
  background: #fff3e0;
  color: #ef6c00;
  grid-column: 1 / -1;
}

.health-item i {
  font-size: 1.2rem;
}

.health-item span {
  font-weight: 500;
}

/* Action Section */
.action-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  margin-top: 20px;
}

.adoption-button {
  width: 100%;
  height: 45px;
  font-size: 1rem;
  font-weight: 600;
}

.unavailable-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

/* Error state */
.error {
  border-radius: 8px;
  text-align: center;
  padding: 30px;
  background: white;
}

/* Responsiveness */
@media (max-width: 768px) {
  .animal-detail-container {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 20px;
  }

  .header-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-info h1 {
    font-size: 2rem;
  }

  .quick-info {
    grid-template-columns: 1fr;
  }

  .health-items {
    grid-template-columns: 1fr;
  }

  .main-image img {
    height: 300px;
  }
}
</style>

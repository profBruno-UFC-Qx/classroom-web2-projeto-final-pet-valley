<template>
  <div class="step-content">
    <h4 class="mb-4">
      <i class="bi bi-airplane me-2"></i>
      Organização da Viagem
    </h4>

    <div v-if="role === 'adopter'" class="adopter-section">
      <!-- Schedule Travel -->
      <div v-if="!adoption.travelArrangements_scheduledDate" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Agendar Retirada do Animal</h5>
          <p class="text-muted mb-3">Escolha a data e hora para retirar seu novo companheiro.</p>
          <div class="mb-3">
            <label for="travelDate" class="form-label">Data e Hora da Retirada</label>
            <InputText id="travelDate" v-model="formData.scheduledDate" type="datetime-local" class="w-100"
              :disabled="loading" />
          </div>
          <Button label="Confirmar Retirada" icon="pi pi-check" @click="scheduleTravel" :loading="loading"
            class="w-100" />
        </div>
      </div>

      <!-- Travel Scheduled -->
      <div v-else class="alert alert-info mb-3">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Retirada Agendada</strong>
        <p class="mb-0 mt-2">
          {{ formatDate(adoption.travelArrangements_scheduledDate) }}
        </p>
      </div>

      <!-- Awaiting Completion -->
      <div v-if="adoption.travelArrangements_scheduledDate && adoption.status !== 'completed'"
        class="alert alert-warning">
        <i class="bi bi-info-circle me-2"></i>
        Aguardando confirmação final da organização...
      </div>

      <!-- Adoption Completed -->
      <div v-if="adoption.status === 'completed'" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Adoção Concluída com Sucesso!</strong>
        <p class="mb-0 mt-2 small">
          Bem-vindo ao seu novo membro da família! 🐾
        </p>
      </div>
    </div>

    <div v-else class="organization-section">
      <div v-if="!adoption.travelArrangements_scheduledDate" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        Aguardando agendamento da retirada pelo adotante...
      </div>

      <!-- Complete Adoption -->
      <div v-if="adoption.travelArrangements_scheduledDate && adoption.status !== 'completed'" class="card">
        <div class="card-body">
          <h5 class="card-title">Finalizar Adoção</h5>
          <div class="mb-3">
            <p class="text-muted mb-3">Data agendada: <strong>{{ formatDate(adoption.travelArrangements_scheduledDate)
                }}</strong></p>
            <p class="text-muted">Após confirmar, o processo de adoção será finalizado com sucesso.</p>
          </div>
          <Button label="Finalizar Adoção" icon="pi pi-check" severity="success" @click="completeAdoption"
            :loading="loading" class="w-100" />
        </div>
      </div>

      <!-- Adoption Completed -->
      <div v-if="adoption.status === 'completed'" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Adoção Finalizada com Sucesso!</strong>
        <p class="mb-0 mt-2 small">
          Processo concluído em {{ formatDate(adoption.updatedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Adoption, ScheduleTravelRequest } from '@/types/adoptions'

const props = defineProps<{
  adoption: Adoption
  role: 'adopter' | 'organization'
  loading: boolean
}>()

const emit = defineEmits<{
  schedule: [data: ScheduleTravelRequest]
  complete: []
}>()

const formData = ref<ScheduleTravelRequest>({
  scheduledDate: ''
})

const scheduleTravel = () => {
  if (formData.value.scheduledDate) {
    emit('schedule', formData.value)
  }
}

const completeAdoption = () => {
  emit('complete')
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="css">
.step-content {
  padding: 2rem 1rem;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
</style>

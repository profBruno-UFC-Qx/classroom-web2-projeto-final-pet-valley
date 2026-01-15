<template>
  <div class="step-content">
    <h4 class="mb-4">
      <i class="bi bi-house me-2"></i>
      Avaliação Domiciliar
    </h4>

    <div v-if="role === 'adopter'" class="adopter-section">
      <!-- Schedule Home Visit -->
      <div v-if="!adoption.homeVisit_scheduledDate" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Agendar Avaliação</h5>
          <p class="text-muted">Escolha uma data para a visita domiciliar.</p>
          <div class="mb-3">
            <label for="visitDate" class="form-label">Data da Visita</label>
            <InputText id="visitDate" v-model="formData.scheduledDate" type="datetime-local" class="w-100"
              :disabled="loading" />
          </div>
          <Button label="Agendar Visita" icon="pi pi-calendar" @click="scheduleHomeVisit" :loading="loading"
            class="w-100" />
        </div>
      </div>

      <!-- Home Visit Scheduled -->
      <div v-else class="alert alert-info mb-3">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Visita Agendada</strong>
        <p class="mb-0 mt-2">
          {{ formatDate(adoption.homeVisit_scheduledDate) }}
        </p>
      </div>

      <!-- Awaiting Completion -->
      <div v-if="adoption.homeVisit_scheduledDate && !adoption.homeVisit_completed" class="alert alert-warning">
        <i class="bi bi-info-circle me-2"></i>
        Aguardando a organização completar a avaliação domiciliar...
      </div>

      <!-- Home Visit Completed -->
      <div v-if="adoption.homeVisit_completed" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Avaliação Realizada com Sucesso</strong>
        <p class="mb-0 mt-2 small">
          {{ formatDate(adoption.homeVisit_completedAt!) }}
        </p>
      </div>
    </div>

    <div v-else class="organization-section">
      <div v-if="!adoption.homeVisit_scheduledDate" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        Aguardando agendamento do adotante...
      </div>

      <!-- Complete Home Visit -->
      <div v-if="adoption.homeVisit_scheduledDate && !adoption.homeVisit_completed" class="card">
        <div class="card-body">
          <h5 class="card-title">Avaliar Residência</h5>
          <div class="mb-3">
            <p class="text-muted mb-3">Data agendada: <strong>{{ formatDate(adoption.homeVisit_scheduledDate)
            }}</strong></p>
          </div>
          <Button label="Marcar Avaliação como Completa" icon="pi pi-check" severity="success"
            @click="completeHomeVisit" :loading="loading" class="w-100" />
        </div>
      </div>

      <!-- Home Visit Completed -->
      <div v-if="adoption.homeVisit_completed" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Avaliação Domiciliar Concluída</strong>
        <p class="mb-0 mt-2 small">
          {{ formatDate(adoption.homeVisit_completedAt!) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Adoption, ScheduleHomeVisitRequest } from '@/types/adoptions'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps<{
  adoption: Adoption
  role: 'adopter' | 'organization'
  loading: boolean
}>()

const emit = defineEmits<{
  schedule: [data: ScheduleHomeVisitRequest]
  complete: []
}>()

const formData = ref<ScheduleHomeVisitRequest>({
  scheduledDate: ''
})

const scheduleHomeVisit = () => {
  if (formData.value.scheduledDate) {
    emit('schedule', formData.value)
  } else {
    alert('Por favor, selecione uma data para a visita domiciliar.')
  }
}

const completeHomeVisit = () => {
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

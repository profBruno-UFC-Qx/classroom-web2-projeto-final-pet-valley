<template>
  <div class="step-content">
    <h4 class="mb-4">
      <i class="bi bi-chat-dots me-2"></i>
      Consulta Inicial
    </h4>

    <div v-if="adoption.initialInquiry_submittedAt" class="alert alert-success">
      <i class="bi bi-check-circle me-2"></i>
      <strong>Consulta Submetida</strong>
      <p class="mb-0 mt-2 small">
        Data: {{ formatDate(adoption.initialInquiry_submittedAt) }}
      </p>
    </div>

    <div v-if="adoption.initialInquiry_answers" class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Tipo de Família</label>
        <div class="form-control bg-light">
          {{ adoption.initialInquiry_answers.familyType }}
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label">Estilo de Vida</label>
        <div class="form-control bg-light">
          {{ adoption.initialInquiry_answers.lifeStyle }}
        </div>
      </div>

      <div class="col-12 mb-3">
        <label class="form-label">Companheiro Ideal</label>
        <div class="form-control bg-light">
          {{ adoption.initialInquiry_answers.idealCompanion }}
        </div>
      </div>
    </div>

    <div class="alert alert-info mt-4">
      <i class="bi bi-info-circle me-2"></i>
      Aguardando agendamento da entrevista pela organização...
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Adoption } from '@/types/adoptions'

defineProps<{
  adoption: Adoption
  role: 'adopter' | 'organization'
  loading: boolean
}>()

defineEmits<{
  submit: []
}>()

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

.form-control.bg-light {
  border: 1px solid #dee2e6;
  padding: 0.75rem;
  background-color: #f8f9fa;
  cursor: default;
}
</style>

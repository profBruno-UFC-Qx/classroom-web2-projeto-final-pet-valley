<template>
    <div class="step-content">
        <h4 class="mb-4">
            <i class="bi bi-camera-video me-2"></i>
            Entrevista
        </h4>

        <div v-if="role === 'organization'" class="organization-section">
            <!-- Schedule Interview -->
            <div v-if="!adoption.interview_scheduledDate" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Agendar Entrevista</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="meetingLink" class="form-label">Link da Reunião</label>
                            <InputText id="meetingLink" v-model="formData.meetingLink"
                                placeholder="https://zoom.us/j/123456789" class="w-100" :disabled="loading" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="scheduledDate" class="form-label">Data Agendada</label>
                            <InputText id="scheduledDate" v-model="formData.scheduledDate" type="datetime-local"
                                class="w-100" :disabled="loading" />
                        </div>
                    </div>
                    <Button label="Agendar Entrevista" icon="pi pi-calendar" @click="scheduleInterview"
                        :loading="loading" class="w-100" />
                </div>
            </div>

            <!-- Interview Scheduled -->
            <div v-else class="alert alert-info mb-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Entrevista Agendada</strong>
                <p class="mb-2 mt-2">
                    <strong>Data:</strong> {{ formatDate(adoption.interview_scheduledDate) }}
                </p>
                <p class="mb-0">
                    <strong>Link:</strong>
                    <a :href="meetingLinkHref" target="_blank">
                        {{ adoption.interview_meetingLink ?? '' }}
                    </a>
                </p>
            </div>

            <!-- Complete Interview -->
            <div v-if="adoption.interview_scheduledDate && !adoption.interview_completedAt" class="card">
                <div class="card-body">
                    <h5 class="card-title">Completar Entrevista</h5>
                    <p class="text-muted">Marcar como realizada após completar a entrevista com o adotante.</p>
                    <Button label="Marcar como Completa" icon="pi pi-check" severity="success"
                        @click="completeInterview" :loading="loading" class="w-100" />
                </div>
            </div>

            <!-- Interview Completed -->
            <div v-if="adoption.interview_completedAt" class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Entrevista Realizada</strong>
                <p class="mb-0 mt-2 small">
                    {{ formatDate(adoption.interview_completedAt) }}
                </p>
            </div>
        </div>

        <div v-else class="adopter-section">
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Aguardando a organização agendar sua entrevista...
            </div>

            <div v-if="adoption.interview_scheduledDate" class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">Sua Entrevista</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Data Agendada</label>
                            <div class="form-control bg-light">
                                {{ formatDate(adoption.interview_scheduledDate) }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Link da Reunião</label>
                            <Button label="Acessar Reunião" icon="pi pi-video" severity="success" @click="gotToMeeting"
                                :loading="loading" class="w-100 form-control" />
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="adoption.interview_completedAt" class="alert alert-success mt-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Entrevista Realizada</strong>
                <p class="mb-0 mt-2 small">
                    {{ formatDate(adoption.interview_completedAt) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Adoption, ScheduleInterviewRequest } from '@/types/adoptions'

const props = defineProps<{
    adoption: Adoption
    role: 'adopter' | 'organization'
    loading: boolean
}>()

const emit = defineEmits<{
    schedule: [data: ScheduleInterviewRequest]
    complete: []
}>()

const formData = ref<ScheduleInterviewRequest>({
    meetingLink: '',
    scheduledDate: ''
})

const scheduleInterview = () => {
    if (formData.value.meetingLink && formData.value.scheduledDate) {
        emit('schedule', formData.value)
    }
}

const completeInterview = () => {
    emit('complete')
}

const meetingLinkHref = computed(() => {
    return props.adoption.interview_meetingLink ?? undefined
})

const gotToMeeting = () => {
    if (props.adoption.interview_meetingLink) {
        window.open(props.adoption.interview_meetingLink, '_blank')
    }
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

.form-control.bg-light {
    border: 1px solid #dee2e6;
    padding: 0.75rem;
    background-color: #f8f9fa;
}

.card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
}
</style>

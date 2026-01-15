<template>
    <!-- Organization -->
    <div v-if="isOrganization">
        <Sidebar />
        <main class="page-content">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-5">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <p class="mt-2">Carregando...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error">
                <p>{{ error }}</p>
                <Button label="Limpar" @click="clearError" />
            </div>

            <!-- No Adoption -->
            <div v-else-if="!currentAdoption">
                <p>Nenhum processo de adoção encontrado.</p>
            </div>

            <div v-else>
                <div style="display: flex; justify-content: center; padding: 1rem;">
                    <h1>Processo de Adoção</h1>
                </div>
                <div class="adoption-line">
                    <div class="info-group">
                        <div class="info-item">
                            Animal: <span>{{ currentAdoption.animal?.name }}</span>
                        </div>
                        <div class="info-item">
                            Adotante: <span>{{ currentAdoption.adopterUser?.name }}</span>
                        </div>
                    </div>

                    <div class="step-badge">
                        Passo atual: {{ currentStep + 1 }}/5
                    </div>
                </div>

                <div class="page-body">
                    <!-- Step 1 -->
                    <div v-if="currentStep === 0">
                        <Step1InitialInquiry :adoption="currentAdoption" :role="userRole" @submit="handleStep1Submit"
                            :loading="loading" />
                    </div>

                    <!-- Step 2 -->
                    <div v-if="currentStep === 1">
                        <Step2Interview :adoption="currentAdoption" :role="userRole" @schedule="handleStep2Schedule"
                            @complete="handleStep2Complete" :loading="loading" />
                    </div>

                    <!-- Step 3 -->
                    <div v-if="currentStep === 2">
                        <Step3HomeVisit :adoption="currentAdoption" :role="userRole" @schedule="handleStep3Schedule"
                            @complete="handleStep3Complete" :loading="loading" />
                    </div>

                    <!-- Step 4 -->
                    <div v-if="currentStep === 3">
                        <Step4Contract :adoption="currentAdoption" :role="userRole" @send="handleStep4Send"
                            @sign="handleStep4Sign" :loading="loading" />
                    </div>

                    <!-- Step 5 -->
                    <div v-if="currentStep === 4">
                        <Step5Travel :adoption="currentAdoption" :role="userRole" @schedule="handleStep5Schedule"
                            @complete="handleStep5Complete" :loading="loading" />
                    </div>

                    <!-- Cancel Button -->
                    <div v-if="currentAdoption.status !== 'completed' && currentAdoption.status !== 'cancelled'">
                        <Button label="Cancelar Adoção" @click="showCancelDialog = true" severity="danger" />
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Adopters -->
    <div v-else>
        <Navbar />
        <div>
            <!-- Loading -->
            <div v-if="loading">
                <p>Carregando...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error">
                <p>{{ error }}</p>
                <Button label="Limpar" @click="clearError" />
            </div>

            <!-- No Adoption -->
            <div v-else-if="!currentAdoption">
                <p>Nenhum processo de adoção encontrado.</p>
            </div>

            <!-- Adoption Process -->
            <div v-else>
                <div style="display: flex; justify-content: center; padding: 1rem;">
                    <h1>Processo de Adoção</h1>
                </div>
                <div class="adoption-line">
                    <div class="info-group">
                        <div class="info-item">
                            Animal: <span>{{ currentAdoption.animal?.name }}</span>
                        </div>
                        <div class="info-item">
                            Organização: <span>{{ currentAdoption.organization?.name }}</span>
                        </div>
                    </div>

                    <div class="step-badge">
                        Passo atual: {{ currentStep + 1 }}/5
                    </div>
                </div>

                <div class="page-body">

                    <!-- Step 1 -->
                    <div v-if="currentStep === 0">
                        <Step1InitialInquiry :adoption="currentAdoption" :role="userRole" @submit="handleStep1Submit"
                            :loading="loading" />
                    </div>

                    <!-- Step 2 -->
                    <div v-if="currentStep === 1">
                        <Step2Interview :adoption="currentAdoption" :role="userRole" @schedule="handleStep2Schedule"
                            @complete="handleStep2Complete" :loading="loading" />
                    </div>

                    <!-- Step 3 -->
                    <div v-if="currentStep === 2">
                        <Step3HomeVisit :adoption="currentAdoption" :role="userRole" @schedule="handleStep3Schedule"
                            @complete="handleStep3Complete" :loading="loading" />
                    </div>

                    <!-- Step 4 -->
                    <div v-if="currentStep === 3">
                        <Step4Contract :adoption="currentAdoption" :role="userRole" @send="handleStep4Send"
                            @sign="handleStep4Sign" :loading="loading" />
                    </div>

                    <!-- Step 5 -->
                    <div v-if="currentStep === 4">
                        <Step5Travel :adoption="currentAdoption" :role="userRole" @schedule="handleStep5Schedule"
                            @complete="handleStep5Complete" :loading="loading" />
                    </div>

                    <!-- Cancel Button -->
                    <div v-if="currentAdoption.status !== 'completed' && currentAdoption.status !== 'cancelled'">
                        <Button label="Cancelar Adoção" @click="showCancelDialog = true" severity="danger" />
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>

    <!-- Cancel Dialog -->
    <Dialog v-model:visible="showCancelDialog" header="Cancelar Adoção" style="width: 25rem" :modal="true">
        <div style="display: grid;">
            <label for="cancelReason">Motivo do Cancelamento</label>
            <Textarea v-model="cancelReason" id="cancelReason" :rows="4" />
        </div>
        <div class="btn-group">
            <Button label="SIM" style="width: 8rem;" @click="handleCancelAdoption" :loading="loading" />
            <Button label="NÃO" style="width: 8rem;" severity="secondary" @click="showCancelDialog = false" />
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdoptionsStore } from '@/stores/adoptionsStore'
import { useAuthStore } from '@/stores/authStore'

import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

import Step1InitialInquiry from '@/components/adoption/Step1InitialInquiry.vue'
import Step2Interview from '@/components/adoption/Step2Interview.vue'
import Step3HomeVisit from '@/components/adoption/Step3HomeVisit.vue'
import Step4Contract from '@/components/adoption/Step4Contract.vue'
import Step5Travel from '@/components/adoption/Step5Travel.vue'

const route = useRoute()
const router = useRouter()
const adoptionsStore = useAdoptionsStore()
const authStore = useAuthStore()

const showCancelDialog = ref(false)
const cancelReason = ref('')
const userRole = ref<'adopter' | 'organization'>('adopter')
const isOrganization = ref(false)
const currentAdoption = computed(() => adoptionsStore.currentAdoption)
const loading = computed(() => adoptionsStore.loading)
const error = computed(() => adoptionsStore.error)

async function loadAdoption(adoptionId: string | undefined) {
    if (!adoptionId) return
    try {
        await adoptionsStore.getAdoption(adoptionId)
        const status = String(adoptionsStore.currentAdoption?.status || '').toLowerCase()
        if (status === 'cancelled' || status === 'canceled') {
            await router.replace('/adocoes')
        }
    } catch (err) {
        console.error('Erro ao carregar adoção:', err)
    }
}

// Redireciona o usuário após cancelar a adoção
watch(
    () => currentAdoption.value,
    (val) => {
        const s = String(val?.status || '').toLowerCase()
        if (s === 'cancelled' || s === 'canceled') {
            router.replace('/adocoes')
        }
    }
)

const currentStep = computed(() => {
    if (!currentAdoption.value) return 0;
    if (currentAdoption.value.status === 'completed') return 4;
    if (currentAdoption.value.contract_documentSigned) return 4;
    if (currentAdoption.value.contract_documentSent) return 3;
    if (currentAdoption.value.homeVisit_completed) return 3;
    if (currentAdoption.value.homeVisit_scheduledDate) return 2;
    if (currentAdoption.value.interview_completedAt) return 2;
    if (currentAdoption.value.interview_scheduledDate) return 1;
    if (currentAdoption.value.initialInquiry_submittedAt) return 1;
    return 0
})

const handleStep1Submit = async () => {
    const adoptionId = route.params.id as string
    if (adoptionId) await loadAdoption(adoptionId)
}

const handleStep2Schedule = async (data: any) => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.scheduleInterview(currentAdoption.value.id, data)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error scheduling interview:', err)
    }
}

const handleStep2Complete = async () => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.completeInterview(currentAdoption.value.id)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error completing interview:', err)
    }
}

const handleStep3Schedule = async (data: any) => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.scheduleHomeVisit(currentAdoption.value.id, data)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error scheduling home visit:', err)
    }
}

const handleStep3Complete = async () => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.completeHomeVisit(currentAdoption.value.id)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error completing home visit:', err)
    }
}

const handleStep4Send = async (data: any) => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.sendContract(currentAdoption.value.id, data)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error sending contract:', err)
    }
}

const handleStep4Sign = async (data: any) => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.signContract(currentAdoption.value.id, data)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error signing contract:', err)
    }
}

const handleStep5Schedule = async (data: any) => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.scheduleTravel(currentAdoption.value.id, data)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error scheduling travel:', err)
    }
}

const handleStep5Complete = async () => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.completeAdoption(currentAdoption.value.id)
        await loadAdoption(currentAdoption.value.id)
    } catch (err) {
        console.error('Error completing adoption:', err)
    }
}

const handleCancelAdoption = async () => {
    if (!currentAdoption.value?.id) return
    try {
        await adoptionsStore.cancelAdoption(currentAdoption.value.id, {
            cancellationReason: cancelReason.value
        })
        showCancelDialog.value = false
        cancelReason.value = ''
    } catch (err) {
        console.error('Error cancelling adoption:', err)
    }
}

const clearError = () => {
    adoptionsStore.error = null
}

onMounted(() => {
    if (authStore.user?.role === 'organization') {
        isOrganization.value = true
        userRole.value = 'organization'
    } else {
        isOrganization.value = false
        userRole.value = 'adopter'
    }

    const adoptionId = route.params.id as string
    if (adoptionId) {
        loadAdoption(adoptionId)
    }
})
</script>


<style scoped>
.page-content {
    margin-left: 260px;
    background-color: var(--surface-ground);
}

.page-body {
    padding: 3rem;
}

.adoption-line {
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 10px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.info-group {
    display: flex;
    gap: 40px;
}

.info-item {
    font-size: 15px;
    color: #444;
}

.info-item span {
    font-weight: 600;
    color: #222;
}

.step-badge {
    background: #e6f7ff;
    color: #0066cc;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
}

:deep(.p-button-outlined) {
    color: #fff !important;
}

:deep(.p-button-text.p-button-danger) {
    color: #fff !important;
}

.btn-group {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
</style>
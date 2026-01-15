<template>
  <div class="step-content">
    <h4 class="mb-4">
      <i class="bi bi-file-earmark-pdf me-2"></i>
      Contrato de Adoção
    </h4>

    <div v-if="role === 'organization'" class="organization-section">
      <!-- Send Contract -->
      <div v-if="!adoption.contract_documentSent" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Enviar Contrato</h5>
          <div class="mb-3">
            <label for="contractContent" class="form-label">Conteúdo do Contrato</label>
            <Textarea id="contractContent" v-model="formData.contractContent"
              placeholder="Cole o conteúdo do contrato aqui..." :rows="6" class="w-100" :disabled="loading" />
          </div>
          <Button label="Enviar Contrato" icon="pi pi-send" @click="sendContract" :loading="loading" class="w-100" />
        </div>
      </div>

      <!-- Contract Sent -->
      <div v-else class="alert alert-info mb-3">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Contrato Enviado</strong>
        <p class="mb-0 mt-2 small">
          Aguardando assinatura do adotante...
        </p>
      </div>

      <!-- Contract Status -->
      <div v-if="adoption.contract_documentSigned" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Contrato Assinado</strong>
        <p class="mb-0 mt-2 small">
          {{ formatDate(adoption.contract_signedAt!) }}
        </p>
      </div>
    </div>

    <div v-else class="adopter-section">
      <div v-if="!adoption.contract_documentSent" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        Aguardando envio do contrato pela organização...
      </div>

      <!-- Sign Contract -->
      <div v-if="adoption.contract_documentSent && !adoption.contract_documentSigned" class="card">
        <div class="card-body">
          <h5 class="card-title">Assinar Contrato</h5>
          <div class="mb-3">
            <p class="text-muted mb-3">Leia o contrato abaixo e assine digitalmente.</p>
            <div class="contract-preview bg-light p-3 mb-3 rounded">
              <p class="text-muted small mb-0">
                {{ adoption.contract_content }}
              </p>
            </div>
          </div>

          <div class="mb-3">
            <label for="signatureCanvas" class="form-label">Sua Assinatura (Clique para desenhar)</label>
            <canvas id="signatureCanvas" ref="signatureCanvas" @mousedown="startDrawing" @mousemove="draw"
              @mouseup="stopDrawing" @mouseleave="stopDrawing" class="border rounded w-100 d-block"
              :style="{ cursor: 'crosshair', height: '200px' }"></canvas>
            <button @click="clearSignature" class="btn btn-sm btn-outline-secondary mt-2 w-100">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Limpar Assinatura
            </button>
          </div>

          <Button label="Assinar Contrato" icon="pi pi-check" severity="success" @click="signContract"
            :loading="loading" :disabled="!hasSignature" class="w-100" />
        </div>
      </div>

      <!-- Contract Signed -->
      <div v-if="adoption.contract_documentSigned" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Contrato Assinado com Sucesso</strong>
        <p class="mb-0 mt-2 small">
          {{ formatDate(adoption.contract_signedAt!) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Adoption, SendContractRequest, SignContractRequest } from '@/types/adoptions'

const props = defineProps<{
  adoption: Adoption
  role: 'adopter' | 'organization'
  loading: boolean
}>()

const emit = defineEmits<{
  send: [data: SendContractRequest]
  sign: [data: SignContractRequest]
}>()

const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasSignature = ref(false)

const formData = ref<SendContractRequest>({
  contractContent: ''
})

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  if (signatureCanvas.value) {
    signatureCanvas.value.width = signatureCanvas.value.offsetWidth
    signatureCanvas.value.height = 200
    ctx = signatureCanvas.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    }
  }
})

const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true
  const { offsetX, offsetY } = e as any
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value) return
  const { offsetX, offsetY } = e as any
  if (ctx) {
    ctx.lineTo(offsetX, offsetY)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    hasSignature.value = true
  }
}

const stopDrawing = () => {
  isDrawing.value = false
  if (ctx) {
    ctx.closePath()
  }
}

const clearSignature = () => {
  if (signatureCanvas.value && ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    hasSignature.value = false
  }
}

const sendContract = () => {
  if (formData.value.contractContent) {
    emit('send', formData.value)
  }
}

const signContract = () => {
  if (signatureCanvas.value && hasSignature.value) {
    emit('sign', {
      signatureData: signatureCanvas.value.toDataURL('image/png')
    })
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

.card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

canvas {
  background: white;
  display: block;
}

.contract-preview {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
}
</style>

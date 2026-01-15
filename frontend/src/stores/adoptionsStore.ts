import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adoptionsService } from '@/services/adoptions'
import type {
  Adoption,
  CreateAdoptionRequest,
  ScheduleInterviewRequest,
  ScheduleHomeVisitRequest,
  SendContractRequest,
  SignContractRequest,
  ScheduleTravelRequest,
  CancelAdoptionRequest,
  AdoptionsListResponse,
} from '@/types/adoptions'

export const useAdoptionsStore = defineStore('adoptions', () => {
  const adoptions = ref<Adoption[]>([])
  const currentAdoption = ref<Adoption | null>(null)
  const total = ref(0)
  const page = ref(1)
  const totalPages = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createAdoption(data: CreateAdoptionRequest): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.createAdoption(data)
      currentAdoption.value = adoption
      adoptions.value.unshift(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar adoção';
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getAdoption(id: string): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.getAdoption(id)
      currentAdoption.value = adoption
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar adoção'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getUserAdoptions(
    userId: string,
    pageNum: number = 1,
    limit: number = 10
  ): Promise<AdoptionsListResponse> {
    loading.value = true
    error.value = null
    try {
      const response = await adoptionsService.getUserAdoptions(userId, pageNum, limit)
      adoptions.value = response.adoptions
      total.value = response.total
      page.value = response.page
      totalPages.value = response.totalPages
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar adoções do usuário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getOrganizationAdoptions(
    orgId: string,
    pageNum: number = 1,
    limit: number = 10
  ): Promise<AdoptionsListResponse> {
    loading.value = true
    error.value = null
    try {
      const response = await adoptionsService.getOrganizationAdoptions(orgId, pageNum, limit)
      adoptions.value = response.adoptions
      total.value = response.total
      page.value = response.page
      totalPages.value = response.totalPages
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar adoções da organização'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleInterview(
    id: string,
    data: ScheduleInterviewRequest
  ): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.scheduleInterview(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao agendar entrevista'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeInterview(id: string): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.completeInterview(id)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao completar entrevista'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleHomeVisit(
    id: string,
    data: ScheduleHomeVisitRequest
  ): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.scheduleHomeVisit(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao agendar visita domiciliar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeHomeVisit(id: string): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.completeHomeVisit(id)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao completar visita domiciliar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendContract(id: string, data: SendContractRequest): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.sendContract(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao enviar contrato'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signContract(id: string, data: SignContractRequest): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.signContract(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao assinar contrato'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleTravel(
    id: string,
    data: ScheduleTravelRequest
  ): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.scheduleTravel(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao agendar viagem'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeAdoption(id: string): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.completeAdoption(id)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao finalizar adoção'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelAdoption(
    id: string,
    data: CancelAdoptionRequest
  ): Promise<Adoption> {
    loading.value = true
    error.value = null
    try {
      const adoption = await adoptionsService.cancelAdoption(id, data)
      currentAdoption.value = adoption
      updateAdoptionInList(adoption)
      return adoption
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao cancelar adoção'
      throw err
    } finally {
      loading.value = false
    }
  }

  function updateAdoptionInList(adoption: Adoption) {
    const index = adoptions.value.findIndex((a) => a.id === adoption.id)
    if (index !== -1) {
      adoptions.value[index] = adoption
    }
  }

  function clearCurrentAdoption() {
    currentAdoption.value = null
  }

  function clearAdoptions() {
    adoptions.value = []
    currentAdoption.value = null
    total.value = 0
    page.value = 1
    totalPages.value = 0
    error.value = null
  }

  return {
    adoptions,
    currentAdoption,
    total,
    page,
    totalPages,
    loading,
    error,
    createAdoption,
    getAdoption,
    getUserAdoptions,
    getOrganizationAdoptions,
    scheduleInterview,
    completeInterview,
    scheduleHomeVisit,
    completeHomeVisit,
    sendContract,
    signContract,
    scheduleTravel,
    completeAdoption,
    cancelAdoption,
    clearCurrentAdoption,
    clearAdoptions,
  }
})

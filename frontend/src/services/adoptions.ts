import api from './api'
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

export const adoptionsService = {
  // POST /adoptions - Create new adoption process
  createAdoption: async (data: CreateAdoptionRequest): Promise<Adoption> => {
    const response = await api.post<Adoption>('/adoptions', data)
    return response.data
  },

  // GET /adoptions/:id - Get adoption details
  getAdoption: async (id: string): Promise<Adoption> => {
    const response = await api.get<Adoption>(`/adoptions/${id}`)
    return response.data
  },

  // GET /adoptions/user/:userId/adoptions - List user adoptions
  getUserAdoptions: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AdoptionsListResponse> => {
    const response = await api.get<AdoptionsListResponse>(
      `/adoptions/user/${userId}/adoptions`,
      {
        params: { page, limit },
      }
    )
    return response.data
  },

  // GET /adoptions/organization/:orgId/adoptions - List organization adoptions
  getOrganizationAdoptions: async (
    orgId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AdoptionsListResponse> => {
    const response = await api.get<AdoptionsListResponse>(
      `/adoptions/organization/${orgId}/adoptions`,
      {
        params: { page, limit },
      }
    )
    return response.data
  },

  // PATCH /adoptions/:id/interview - Schedule interview
  scheduleInterview: async (
    id: string,
    data: ScheduleInterviewRequest
  ): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/interview`, data)
    return response.data
  },

  // PATCH /adoptions/:id/interview-complete - Complete interview
  completeInterview: async (id: string): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/interview-complete`, {})
    return response.data
  },

  // PATCH /adoptions/:id/home-visit - Schedule home visit
  scheduleHomeVisit: async (
    id: string,
    data: ScheduleHomeVisitRequest
  ): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/home-visit`, data)
    return response.data
  },

  // PATCH /adoptions/:id/home-visit-complete - Complete home visit
  completeHomeVisit: async (id: string): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/home-visit-complete`, {})
    return response.data
  },

  // PATCH /adoptions/:id/contract - Send contract
  sendContract: async (id: string, data: SendContractRequest): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/contract`, data)
    return response.data
  },

  // PATCH /adoptions/:id/contract-sign - Sign contract
  signContract: async (id: string, data: SignContractRequest): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/contract-sign`, data)
    return response.data
  },

  // PATCH /adoptions/:id/travel - Schedule travel
  scheduleTravel: async (
    id: string,
    data: ScheduleTravelRequest
  ): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/travel`, data)
    return response.data
  },

  // PATCH /adoptions/:id/complete - Complete adoption
  completeAdoption: async (id: string): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/complete`, {})
    return response.data
  },

  // PATCH /adoptions/:id/cancel - Cancel adoption
  cancelAdoption: async (
    id: string,
    data: CancelAdoptionRequest
  ): Promise<Adoption> => {
    const response = await api.patch<Adoption>(`/adoptions/${id}/cancel`, data)
    return response.data
  },
}

import type { GetOrganizationParams, GetOrganizationResponse, Organization, OrganizationCreateDTO, OrganizationSelectOption, OrganizationUpdateDTO } from '@/types/organization.type';
import api from './api'
import type { ChangePassword } from '@/types/auth.type';

export async function createOrg(body: OrganizationCreateDTO): Promise<Organization> {
    try {
        const response = await api.post('/organizations', body)
        return response.data
    } catch (error) {
        console.error('Erro ao criar organização:', error)
        throw error
    }
}

export async function getOrganizations(body: GetOrganizationParams): Promise<GetOrganizationResponse> {
    const params = new URLSearchParams()

    params.append('page', body.page.toString())
    params.append('limit', body.limit.toString())

    if (body.filters?.name) params.append('name', body.filters.name)
    if (body.filters?.document) params.append('document', body.filters.document)
    if (body.filters?.email) params.append('email', body.filters.email)

    const response = await api.get(`/organizations?${params.toString()}`)
    return response.data
}

export async function getAllOrganizations(): Promise<OrganizationSelectOption[]> {
    const response = await api.get(`/organizations/selected`)
    return response.data
}

export async function getOrganization(id: string): Promise<Organization> {
    const response = await api.get(`/organizations/${id}`)
    return response.data
}

export async function getOrganizationByToken(): Promise<Organization> {
    const response = await api.get(`/organizations/data`)
    return response.data
}

export async function updateOrganization(body: OrganizationUpdateDTO, id: string): Promise<Organization> {
    const response = await api.put(`/organizations/${id}`, body)
    return response.data
}

export async function updatePassword(body: ChangePassword, id: string): Promise<Organization> {
    const response = await api.patch(`/organizations/${id}/password`, body)
    return response.data
}

export async function deleteOrganization(id: string): Promise<Organization> {
    const response = await api.delete(`/organizations/${id}`)
    return response.data
}
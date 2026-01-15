import type { GetUsersParams, GetUsersResponse, User, UserCreateDTO, UserUpdateDTO } from '@/types/user.type'
import api from './api'
import type { ChangePassword } from '@/types/auth.type'

export async function createAdopter(body: UserCreateDTO): Promise<User> {
    body.role = 'adopter'
    const response = await api.post('/users', body)
    return response.data
}

export async function getUsers(body: GetUsersParams): Promise<GetUsersResponse> {
    const params = new URLSearchParams()

    params.append('page', body.page.toString())
    params.append('limit', body.limit.toString())

    if (body.filters?.name) params.append('name', body.filters.name)
    if (body.filters?.document) params.append('document', body.filters.document)
    if (body.filters?.email) params.append('email', body.filters.email)

    const response = await api.get(`/users?${params.toString()}`)
    return response.data
}

export async function getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
}

export async function getUserByToken(): Promise<User> {
    const response = await api.get(`/users/data`)
    return response.data
}

export async function updateUser(body: UserUpdateDTO, id: string): Promise<User> {
    const response = await api.put(`/users/${id}`, body)
    return response.data
}

export async function updatePassword(body: ChangePassword, id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/password`, body)
    return response.data
}

export async function deleteUser(id: string): Promise<User> {
    const response = await api.delete(`/users/${id}`)
    return response.data
}
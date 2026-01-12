import type { AuthResponse, RegisterRequest } from '@/types/auth.type'
import api from './api'

export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
        })
        return response.data
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        throw error
    }
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
    try {
        const response = await api.post('/auth/register', body)
        return response.data
    } catch (error) {
        console.error('Erro ao registrar usuário:', error)
        throw error
    }
}
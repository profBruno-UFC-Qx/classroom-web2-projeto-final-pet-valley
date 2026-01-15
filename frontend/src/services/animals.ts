import type { Animal, AnimalCreateDTO, AnimalsSearchResponse, AnimalUpdateDTO, SearchAnimalsParams } from '@/types/animals'
import api from './api'

export async function getAnimals(params: SearchAnimalsParams): Promise<AnimalsSearchResponse> {
    try {
        const { data } = await api.get<AnimalsSearchResponse>(
            '/animals/search',
            { params }
        )
        return data
    } catch (error) {
        console.error('Erro ao buscar animais:', error)
        return {
            animals: [],
            total: 0,
            page: 1,
            totalPages: 0
        }
    }
}

export async function getAnimalsByOrganization(params: SearchAnimalsParams): Promise<AnimalsSearchResponse> {
    try {
        const { data } = await api.get<AnimalsSearchResponse>(
            '/animals/organization',
            { params }
        )
        return data
    } catch (error) {
        console.error('Erro ao buscar animais:', error)
        return {
            animals: [],
            total: 0,
            page: 1,
            totalPages: 0
        }
    }
}

export async function getAnimal(id: string): Promise<Animal> {
    const response = await api.get(`/animals/${id}`)
    return response.data
}

export async function createAnimal(
    payload: AnimalCreateDTO
): Promise<Animal> {
    const formData = new FormData()

    formData.append('organizationId', payload.organizationId)
    formData.append('name', payload.name)
    formData.append('species', payload.species)
    formData.append('breed', payload.breed)
    formData.append('sex', payload.sex)
    formData.append('age', String(payload.age))
    formData.append('size', String(payload.size))
    formData.append('weight', String(payload.weight))
    formData.append('description', payload.description)
    formData.append('vaccinated', String(payload.vaccinated))
    formData.append('neutered', String(payload.neutered))
    formData.append('status', payload.status)

    if (payload.specialNeeds) {
        formData.append('specialNeeds', payload.specialNeeds)
    }

    // Múltiplos arquivos
    payload.images.forEach((file) => {
        formData.append('images', file)
    })

    const response = await api.post('/animals', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data
}

export async function updateAnimal(body: AnimalUpdateDTO, id: string): Promise<Animal> {
    const response = await api.put(`/animals/${id}`, body)
    return response.data
}

export async function deleteAnimal(id: string): Promise<Animal> {
    const response = await api.delete(`/animals/${id}`)
    return response.data
}
import { defineStore } from 'pinia'
import type { AnimalsSearchResponse, SearchAnimalsParams, Animal, AnimalCreateDTO, AnimalUpdateDTO } from '@/types/animals'
import { createAnimal, deleteAnimal, getAnimal, getAnimals, getAnimalsByOrganization, updateAnimal } from '@/services/animals'

interface AnimalState {
    animals: Animal[]
    selectedAnimal: Animal | null
    total: number
    page: number
    totalPages: number
    loading: boolean
    error: string | null
}

export const useAnimalStore = defineStore('animals', {
    state: (): AnimalState => ({
        animals: [],
        selectedAnimal: null,
        total: 0,
        page: 1,
        totalPages: 0,
        loading: false,
        error: null
    }),

    getters: {
        // Getters para acessar dados específicos
        availableAnimals: (state) => state.animals.filter(animal => animal.status === 'available'),
        adoptedAnimals: (state) => state.animals.filter(animal => animal.status === 'adopted'),
        getAnimalById: (state) => (id: string) => state.animals.find(animal => animal.id === id)
    },

    actions: {
        async fetchAnimalById(id: string) {
            this.loading = true
            this.error = null

            try {
                const animal = await getAnimal(id)

                this.selectedAnimal = animal

                // opcional: manter sincronizado na lista
                const index = this.animals.findIndex(a => a.id === id)
                if (index !== -1) {
                    this.animals[index] = animal
                }

                return animal
            } catch (err) {
                this.error = 'Erro ao carregar animal'
                throw err
            } finally {
                this.loading = false
            }
        },
        async fetchAnimals(params: SearchAnimalsParams = {}) {
            this.loading = true
            this.error = null

            try {
                const response: AnimalsSearchResponse = await getAnimals({
                    page: this.page,
                    limit: 8, // ou o valor que preferir
                    ...params
                })

                this.animals = response.animals
                this.total = response.total
                this.page = response.page
                this.totalPages = response.totalPages
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Erro ao carregar animais'
                console.error('Erro no store:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchAnimalsByOrganization(params: SearchAnimalsParams = {}) {
            this.loading = true
            this.error = null

            try {
                const response: AnimalsSearchResponse = await getAnimalsByOrganization({
                    page: this.page,
                    limit: 8, // ou o valor que preferir
                    ...params
                })

                this.animals = response.animals
                this.total = response.total
                this.page = response.page
                this.totalPages = response.totalPages
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Erro ao carregar animais'
                console.error('Erro no store:', error)
            } finally {
                this.loading = false
            }
        },

        async searchAnimals(filters: SearchAnimalsParams) {
            await this.fetchAnimals(filters)
        },

        setPage(newPage: number) {
            this.page = newPage
            this.fetchAnimals() // Recarrega com a nova página
        },

        clearFilters() {
            this.page = 1
            this.fetchAnimals()
        },

        async createAnimal(payload: AnimalCreateDTO) {
            this.loading = true
            this.error = null

            try {
                const animal = await createAnimal(payload)

                this.animals.unshift(animal)

                return animal
            } catch (err) {
                this.error = 'Erro ao cadastrar animal'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateAnimal(id: string, payload: AnimalUpdateDTO) {
            this.loading = true
            this.error = null

            try {
                const updatedAnimal = await updateAnimal(payload, id)

                const index = this.animals.findIndex(a => a.id === id)
                if (index !== -1) {
                    this.animals[index] = updatedAnimal
                }

                return updatedAnimal
            } catch (err) {
                this.error = 'Erro ao atualizar animal'
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteAnimal(id: string) {
            this.loading = true
            this.error = null

            try {
                await deleteAnimal(id)

                this.animals = this.animals.filter(a => a.id !== id)
            } catch (err) {
                this.error = 'Erro ao remover animal'
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
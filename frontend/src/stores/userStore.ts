import { defineStore } from 'pinia'
import { getUsers, createAdopter, deleteUser, updateUser } from '@/services/users'
import type { User, UserCreateDTO, GetUsersParams, UserUpdateDTO } from '@/types/user.type'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as User[],
        total: 0,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchUsers(params: GetUsersParams) {
            this.loading = true
            this.error = null

            try {
                const response = await getUsers(params)
                this.users = response.users ?? [];
                this.total = response.total ?? 0;
            } catch (err) {
                this.error = 'Erro ao carregar usuários'
                this.users = []
                this.total = 0
                throw err
            } finally {
                this.loading = false
            }
        },

        async createAdopterUser(payload: UserCreateDTO) {
            this.loading = true
            this.error = null

            try {
                const user = await createAdopter(payload)

                // Atualiza lista local (UX instantânea)
                this.users.unshift(user)
                this.total++

                return user
            } catch (err) {
                this.error = 'Erro ao criar usuário'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateUser(id: string, payload: UserUpdateDTO) {
            this.loading = true
            this.error = null

            try {
                const updatedUser = await updateUser(payload, id)

                const index = this.users.findIndex(u => u.id === id)
                if (index !== -1) {
                    this.users[index] = updatedUser
                }

                return updatedUser
            } catch (err) {
                this.error = 'Erro ao atualizar usuário'
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id: string) {
            this.loading = true
            this.error = null

            try {
                const deletedUser = await deleteUser(id)

                this.users = this.users.filter(u => u.id !== id)
                this.total--

                return deletedUser
            } catch (err) {
                this.error = 'Erro ao remover usuário'
                throw err
            } finally {
                this.loading = false
            }
        },
    }
})

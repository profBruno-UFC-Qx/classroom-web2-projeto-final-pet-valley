import { defineStore } from 'pinia'
import { getOrganizations, createOrg, updateOrganization, deleteOrganization, getAllOrganizations, getOrganization, updatePassword, getOrganizationByToken } from '@/services/organization'
import type {
    Organization,
    OrganizationCreateDTO,
    GetOrganizationParams,
    OrganizationUpdateDTO,
    OrganizationSelectOption
} from '@/types/organization.type'
import type { ChangePassword } from '@/types/auth.type'

export const useOrganizationStore = defineStore('organization', {
    state: () => ({
        organizations: [] as Organization[],
        organizationOptions: [] as OrganizationSelectOption[],
        total: 0,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchOrganizationById(id: string): Promise<Organization> {
            this.loading = true
            this.error = null

            try {
                const organization = await getOrganization(id)
                return organization
            } catch (err) {
                console.error(err)
                this.error = 'Erro ao buscar organização'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchOrganizationByToken(): Promise<Organization> {
            this.loading = true
            this.error = null

            try {
                const organization = await getOrganizationByToken()
                return organization
            } catch (err) {
                console.error(err)
                this.error = 'Erro ao buscar organização'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchOrganizationOptions() {
            try {
                this.loading = true
                const options = await getAllOrganizations()
                this.organizationOptions = options
            } catch (err) {
                console.error('Erro ao carregar opções de organizações:', err)
                this.organizationOptions = []
            } finally {
                this.loading = false
            }
        },

        async fetchOrganizations(params: GetOrganizationParams) {
            this.loading = true
            this.error = null

            try {
                const response = await getOrganizations(params)

                this.organizations = response.organizations ?? []
                this.total = response.total ?? 0
            } catch (err) {
                console.error(err)
                this.error = 'Erro ao carregar organizações'
                this.organizations = []
                this.total = 0
                throw err
            } finally {
                this.loading = false
            }
        },

        async createOrganization(payload: OrganizationCreateDTO) {
            this.loading = true
            this.error = null

            try {
                const organization = await createOrg(payload)

                // UX instantâneo (igual userStore)
                this.organizations.unshift(organization)
                this.total++

                return organization
            } catch (err) {
                console.error(err)
                this.error = 'Erro ao criar organização'
                throw err
            } finally {
                this.loading = false
            }
        },
        async updateOrganization(id: string, payload: OrganizationUpdateDTO) {
            this.loading = true
            this.error = null

            try {
                const updatedOrganization = await updateOrganization(payload, id)

                const index = this.organizations.findIndex(u => u.id === id)
                if (index !== -1) {
                    this.organizations[index] = updatedOrganization
                }

                return updatedOrganization
            } catch (err) {
                this.error = 'Erro ao atualizar organização'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updatePassword(id: string, payload: ChangePassword) {
            this.loading = true
            this.error = null

            try {
                await updatePassword(payload, id)
                return true
            } catch (err) {
                this.error = 'Erro ao atualizar senha'
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteOrganization(id: string) {
            this.loading = true
            this.error = null

            try {
                const deletedOrganization = await deleteOrganization(id)

                this.organizations = this.organizations.filter(u => u.id !== id)
                this.total--

                return deletedOrganization
            } catch (err) {
                this.error = 'Erro ao remover organização'
                throw err
            } finally {
                this.loading = false
            }
        },
    }
})

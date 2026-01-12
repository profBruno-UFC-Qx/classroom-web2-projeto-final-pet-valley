import { defineStore } from 'pinia'
import type { Address, CreateAddressDTO } from '@/types/address'
import {
    checkHasAddress,
    getMyAddress,
    createAddress,
    updateAddress
} from '@/services/address'

interface AddressState {
    address: Address | null
    hasAddress: boolean
    loading: boolean
    error: string | null
}

export const useAddressStore = defineStore('address', {
    state: (): AddressState => ({
        address: null,
        hasAddress: false,
        loading: false,
        error: null
    }),

    getters: {
        hasUserAddress: (state) => state.hasAddress,
        fullAddress: (state) =>
            state.address
                ? `${state.address.street}, ${state.address.houseNumber} - ${state.address.neighborhood}, ${state.address.city}/${state.address.state}`
                : null
    },

    actions: {
        async checkHasAddress() {
            this.loading = true
            this.error = null

            try {
                const has = await checkHasAddress()
                this.hasAddress = Boolean(has)
                return this.hasAddress
            } catch (err) {
                this.error = 'Erro ao verificar endereço'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchMyAddress() {
            this.loading = true
            this.error = null

            try {
                const address = await getMyAddress()
                this.address = address
                this.hasAddress = true
                return address
            } catch (err) {
                this.error = 'Erro ao buscar endereço'
                this.address = null
                this.hasAddress = false
                throw err
            } finally {
                this.loading = false
            }
        },

        async createAddress(payload: CreateAddressDTO) {
            this.loading = true
            this.error = null

            try {
                const address = await createAddress(payload)
                this.address = address
                this.hasAddress = true
                return address
            } catch (err) {
                this.error = 'Erro ao criar endereço'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateAddress(payload: CreateAddressDTO) {
            this.loading = true
            this.error = null

            try {
                const address = await updateAddress(payload)
                this.address = address
                this.hasAddress = true
                return address
            } catch (err) {
                this.error = 'Erro ao atualizar endereço'
                throw err
            } finally {
                this.loading = false
            }
        },

        clearAddress() {
            this.address = null
            this.hasAddress = false
            this.error = null
        }
    }
})

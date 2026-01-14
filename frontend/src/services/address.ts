import type { Address, CreateAddressDTO } from '@/types/address'
import api from './api'

export async function checkHasAddress(): Promise<Boolean> {
    const response = await api.get(`/address/has-address`)
    return response.data.hasAddress
}

export async function getMyAddress(): Promise<Address> {
    const response = await api.get(`/address/my-address`)
    return response.data
}

export async function createAddress(body: CreateAddressDTO): Promise<Address> {
    const response = await api.post(`/address`, body)
    return response.data
}

export async function updateAddress(body: CreateAddressDTO): Promise<Address> {
    const response = await api.put(`/address`, body)
    return response.data
}
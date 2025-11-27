import { Repository } from 'typeorm';
import AppDataSource from '../utils/database';
import { Address } from '../entities/address';

export class AddressService {
    private addressRepository: Repository<Address>;

    constructor() {
        this.addressRepository = AppDataSource.getRepository(Address);
    }

    async createAddress(addressData: {
        ownerId: string;
        cep: number;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        houseNumber: number;
        complement?: string;
    }): Promise<Address> {
        // Verificar se já existe endereço para este ownerId
        const existingAddress = await this.addressRepository.findOne({
            where: { ownerId: addressData.ownerId }
        });

        if (existingAddress) {
            throw new Error('User already has an address registered');
        }

        const address = this.addressRepository.create(addressData);
        return await this.addressRepository.save(address);
    }

    async getAddressByOwnerId(ownerId: string): Promise<Address | null> {
        return await this.addressRepository.findOne({
            where: { ownerId }
        });
    }

    async hasAddress(ownerId: string): Promise<boolean> {
        const address = await this.getAddressByOwnerId(ownerId);
        return !!address;
    }

    async updateAddress(ownerId: string, updateData: Partial<Address>): Promise<Address> {
        const address = await this.getAddressByOwnerId(ownerId);

        if (!address) {
            throw new Error('Address not found');
        }

        await this.addressRepository.update(address.id, updateData);
        return await this.getAddressByOwnerId(ownerId) as Address;
    }

    async deleteAddress(ownerId: string): Promise<{ message: string }> {
        const address = await this.getAddressByOwnerId(ownerId);

        if (!address) {
            throw new Error('Address not found');
        }

        await this.addressRepository.delete(address.id);
        return { message: 'Address deleted successfully' };
    }

    async getAddressById(id: string): Promise<Address | null> {
        return await this.addressRepository.findOne({
            where: { id }
        });
    }
}
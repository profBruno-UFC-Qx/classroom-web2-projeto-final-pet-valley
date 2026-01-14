export interface Address {
    id: string;
    ownerId: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    houseNumber: string;
    complement?: string;
}

export interface CreateAddressDTO {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    houseNumber: string;
    complement?: string;
}
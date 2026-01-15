export interface Animal {
    id: string;
    organizationId: string;
    name: string;
    species: string;
    breed: string;
    sex: 'macho' | 'femea';
    age: number;
    size: number;
    weight: number;
    description: string;
    vaccinated: boolean;
    neutered: boolean;
    specialNeeds: string | null;
    status: 'available' | 'adopted' | 'pending';
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface AnimalCreateDTO {
    organizationId: string
    name: string
    species: string
    breed: string
    sex: 'macho' | 'femea'
    age: number
    size: number
    weight: number
    description: string
    vaccinated: boolean
    neutered: boolean
    specialNeeds?: string
    status: 'available' | 'adopted' | 'pending'
    images: File[]
}

export interface AnimalUpdateDTO {
    name?: string;
    sex: "macho" | "femea";
    species?: string;
    breed?: string;
    age?: number;
    weight?: number;
    size?: number;
    description?: string;
    vaccinated?: boolean;
    neutered?: boolean;
    specialNeeds?: string;
}

export interface AnimalsSearchResponse {
    animals: Animal[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AnimalFilters {
    species?: string;
    breed?: string;
    sex?: string;
    vaccinated?: boolean;
    status?: string;
}

export interface SearchAnimalsParams extends AnimalFilters {
    page?: number;
    limit?: number;
}
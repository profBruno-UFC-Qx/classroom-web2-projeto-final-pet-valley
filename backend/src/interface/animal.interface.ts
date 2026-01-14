export interface AnimalCreateDto {
    organizationId: string;
    name: string;
    species: string;
    sex: "macho" | "femea";
    breed: string;
    age: number;
    size: number;
    weight: number;
    description: string;
    vaccinated: boolean;
    neutered: boolean;
    specialNeeds?: string;
    status: "available" | "adopted" | "pending";
    images: string[];
}

export interface AnimalUpdateDto {
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
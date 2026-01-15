export interface User {
    id: string;
    role: 'admin' | 'adopter';
    name: string;
    document: string;
    phone: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateDTO {
    name: string;
    document: string;
    phone: string;
    email: string;
    password: string;
    role: string;
}

export interface UserUpdateDTO {
    name: string;
    document: string;
    phone: string;
    email: string;
}

export interface GetUsersParams {
    page: number;
    limit: number;
    filters?: {
        name?: string;
        document?: string;
        email?: string;
    };
}

export interface GetUsersResponse {
    users: User[]
    total: number
    page: number
    totalPages: number
}
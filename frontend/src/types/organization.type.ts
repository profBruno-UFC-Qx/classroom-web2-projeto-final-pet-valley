export interface OrganizationCreateDTO {
    name: string;
    type: "ong" | "protector";
    document: string;
    documentType: "cpf" | "cnpj";
    phone: string;
    email: string;
    password: string;
}

export interface OrganizationUpdateDTO {
    name: string;
    document: string;
    phone: string;
    email: string;
}

export interface Organization {
    id: string;
    name: string;
    type: "ong" | "protector";
    document: string;
    documentType: "cpf" | "cnpj";
    status: "pending" | "approved" | "rejected";
    phone: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetOrganizationParams {
    page: number;
    limit: number;
    filters?: {
        name?: string;
        document?: string;
        email?: string;
    };
}

export interface GetOrganizationResponse {
    organizations: Organization[]
    total: number
    page: number
    totalPages: number
}

export interface OrganizationSelectOption {
    label: string;
    value: string;
}
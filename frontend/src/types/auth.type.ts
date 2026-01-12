export interface Login {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        role: string;
        name: string;
        email: string;
        type: string;
        status: string;
        documentType: string;
    };
    token: string;
}

export interface AuthUser {
    id: string;
    role: string;
    name: string;
    email: string;
    type: string;
    status: string;
    documentType: string;
}

export interface RegisterRequest {
    // Controle de fluxo
    isOrganization: boolean;

    // Campos comuns
    name: string;
    email: string;
    password: string;
    phone: string;
    document: string;

    // Campos exclusivos de Organization (obrigatórios se isOrganization = true)
    // type?: "ong" | "protector";
    // documentType?: "cpf" | "cnpj";
    type?: string;
    documentType?: string;
}

import { Request } from "express";

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = "admin" | "adopter" | "organization";

export interface AuthResponse {
  user: {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    // Campos específicos de User
    document?: string;
    phone?: string;
    // Campos específicos de Organization
    type?: "ong" | "protector";
    status?: "pending" | "approved" | "rejected";
    documentType?: "cpf" | "cnpj";
  };
  token: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    type?: "ong" | "protector";
    status?: "pending" | "approved" | "rejected";
  };
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

  // Campos exclusivos de Organization (opcionais para User)
  type?: "ong" | "protector";
  documentType?: "cpf" | "cnpj";
}

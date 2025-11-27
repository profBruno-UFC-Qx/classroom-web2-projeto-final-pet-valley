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
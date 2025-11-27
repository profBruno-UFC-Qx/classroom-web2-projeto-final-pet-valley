import { Repository } from "typeorm";
import AppDataSource from "../utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  LoginCredentials,
  AuthResponse,
  JwtPayload,
  UserRole,
} from "../types/auth.types";
import { User } from "../entities/user";
import { Organization } from "../entities/organization";

export class AuthService {
  private userRepository: Repository<User>;
  private organizationRepository: Repository<Organization>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.organizationRepository = AppDataSource.getRepository(Organization);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Primeiro busca no User
    let user = await this.userRepository.findOne({ where: { email } });
    let role: UserRole = "adopter";
    let userData: any;

    if (user) {
      // É um User
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      role = user.role as UserRole;
      userData = {
        id: user.id,
        role,
        name: user.name,
        email: user.email,
        document: user.document,
        phone: user.phone,
      };
    } else {
      // Busca na Organization
      const organization = await this.organizationRepository.findOne({
        where: { email },
      });
      if (!organization) {
        throw new Error("User not found");
      }

      // Verificar se organization está aprovada
      if (organization.status !== "approved") {
        throw new Error("Organization not approved");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        organization.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      role = "organization";
      userData = {
        id: organization.id,
        role,
        name: organization.name,
        email: organization.email,
        type: organization.type,
        status: organization.status,
        documentType: organization.documentType,
      };
    }

    // Gerar token JWT (30 dias de duração)
    const token = jwt.sign(
      { userId: userData.id, role } as JwtPayload,
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "30d" }
    );

    return {
      user: userData,
      token,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      ) as JwtPayload;

      let userData: any;

      if (payload.role === "organization") {
        // Buscar organization
        const organization = await this.organizationRepository.findOne({
          where: { id: payload.userId },
        });
        if (!organization || organization.status !== "approved") {
          throw new Error("Organization not found or not approved");
        }
        userData = {
          id: organization.id,
          role: payload.role,
          name: organization.name,
          email: organization.email,
          type: organization.type,
          status: organization.status,
        };
      } else {
        // Buscar user (admin ou adopter)
        const user = await this.userRepository.findOne({
          where: { id: payload.userId },
        });
        if (!user) {
          throw new Error("User not found");
        }
        userData = {
          id: user.id,
          role: user.role as UserRole,
          name: user.name,
          email: user.email,
          document: user.document,
          phone: user.phone,
        };
      }

      return userData;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

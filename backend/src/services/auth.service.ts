import { Repository } from "typeorm";
import { User } from "../entities/user";
import AppDataSource from "../utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  LoginCredentials,
  AuthResponse,
  JwtPayload,
} from "../types/auth.types";

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Buscar usuário por email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Gerar token JWT (30 dias de duração)
    const token = jwt.sign(
      { userId: user.id } as JwtPayload,
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "30d" }
    );

    // Retornar usuário (sem a senha) e token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      ) as JwtPayload;
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

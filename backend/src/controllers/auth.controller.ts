import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginCredentials, AuthenticatedRequest } from "../types/auth.types";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const credentials: LoginCredentials = req.body;

    if (!credentials.email || !credentials.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const authResponse = await authService.login(credentials);
    res.status(200).json(authResponse);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // O middleware já adicionou o user na request
    const user = req.user;
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

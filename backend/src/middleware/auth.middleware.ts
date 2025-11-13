import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types/auth.types";

const authService = new AuthService();

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const user = await authService.validateToken(token);

    // Adicionar informações básicas do user na request
    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error: any) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

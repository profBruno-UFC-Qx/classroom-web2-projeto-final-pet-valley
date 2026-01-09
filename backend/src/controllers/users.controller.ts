import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from "../types/auth.types";

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getFilteredUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters = {
      name: req.query.name as string | undefined,
      document: req.query.document as string | undefined,
      email: req.query.email as string | undefined,
    };

    const result = await userService.getFilteredUsers(page, limit, filters);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Usuário só pode atualizar seu próprio perfil, admin pode atualizar qualquer um
    if (req.user?.role !== "admin" && req.user?.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Apenas admin pode deletar usuários
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await userService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
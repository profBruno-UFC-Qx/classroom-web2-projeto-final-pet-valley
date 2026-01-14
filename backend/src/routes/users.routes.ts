import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getFilteredUsers,
  updatePassword,
  getUserData,
} from "../controllers/users.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  requireAdmin,
  requireAdminOrAdopter,
} from "../middleware/role.middleware";

const router = Router();

// Apenas admin pode criar usuários (ou deixar aberto para registro?)
router.post("/", createUser);

// router.get("/", getFilteredUsers);
router.get("/", authenticateToken, requireAdmin, getFilteredUsers);

router.get("/data", authenticateToken, requireAdminOrAdopter, getUserData);

// Usuário pode ver seu próprio perfil, admin pode ver qualquer um
router.get("/:id", authenticateToken, requireAdminOrAdopter, getUser);

// Usuário pode atualizar seu próprio perfil, admin pode atualizar qualquer um
router.put("/:id", authenticateToken, requireAdminOrAdopter, updateUser);

router.patch("/:id/password", authenticateToken, requireAdminOrAdopter, updatePassword);

// Apenas admin pode deletar usuários
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

export default router;

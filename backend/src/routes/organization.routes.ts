import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganization,
  approveOrganization,
  rejectOrganization,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizations.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  requireAdmin,
  requireAdminOrAdopter,
} from "../middleware/role.middleware";

const router = Router();

// Qualquer um pode criar organização (fica como pending)
router.post("/", createOrganization);

// Listar organizações (público, mas com filtro por status)
router.get("/", getOrganizations);

// Ver organização específica (público)
router.get("/:id", getOrganization);

// Apenas admin pode aprovar/rejeitar
router.patch(
  "/:id/approve",
  authenticateToken,
  requireAdmin,
  approveOrganization
);
router.patch(
  "/:id/reject",
  authenticateToken,
  requireAdmin,
  rejectOrganization
);

// Apenas admin pode atualizar/deletar
router.put("/:id", authenticateToken, requireAdmin, updateOrganization);
router.delete("/:id", authenticateToken, requireAdmin, deleteOrganization);

export default router;

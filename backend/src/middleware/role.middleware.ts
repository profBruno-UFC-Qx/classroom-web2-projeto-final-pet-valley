import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interface/auth.interface";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

// Middlewares específicos para roles comuns
export const requireAdmin = requireRole(["admin"]);
export const requireAdopter = requireRole(["adopter"]);
export const requireOrganization = requireRole(["organization"]);
export const requireAdminOrAdopter = requireRole(["admin", "adopter"]);
export const requireAdminOrOrganization = requireRole([
  "admin",
  "organization",
]);

import { Router } from "express";
import { login, getProfile, register } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticateToken, getProfile);

export default router;
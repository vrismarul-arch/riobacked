// backend/routes/authRoutes.js
import express from "express";
import {
  adminLogin,
  refreshToken,
  adminLogout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/refresh", refreshToken);
router.post("/logout", adminLogout);

export default router;

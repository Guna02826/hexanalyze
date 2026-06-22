import express from "express";
import {
  getCurrentUser,
  loginDemoUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/me", requireAuth, getCurrentUser);
authRoutes.post("/demo-login", loginDemoUser);

export default authRoutes;

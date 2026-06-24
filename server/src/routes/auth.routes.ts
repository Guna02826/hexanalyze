import express from "express";
import {
  loginDemoUser,
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller.js";


const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/demo-login", loginDemoUser);
authRoutes.get("/refresh", refreshAccessToken);
authRoutes.post("/logout", logoutUser);

export default authRoutes;

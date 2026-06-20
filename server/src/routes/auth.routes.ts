import express from "express";
import {
  getUserDetail,
  loginDemoUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserDetail);
router.post("/demo-login", loginDemoUser);

export default router;

import express from "express";
import {
  getUserDetail,
  loginDemoUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getUserDetail);
authRouter.post("/demo-login", loginDemoUser);

export default authRouter;

import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  loginDemoUser,
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller.js";


const authRoutes = express.Router();

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

authRoutes.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    validateRequest,
  ],
  registerUser
);

authRoutes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser
);

authRoutes.post("/demo-login", loginDemoUser);
authRoutes.get("/refresh", refreshAccessToken);
authRoutes.post("/logout", logoutUser);

export default authRoutes;

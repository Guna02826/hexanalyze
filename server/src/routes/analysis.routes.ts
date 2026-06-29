import express, { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { body } from "express-validator";
import {
  analyzeResume,
  getAnalysisHistory,
} from "../controllers/analysis.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "./auth.routes.js";

const analysisRoutes = express.Router();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    // Reject non-PDFs silently. req.file will be undefined in the controller.
    cb(null, false);
  }
};

const uploadMiddleware = multer({ 
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

analysisRoutes.post(
  "/",
  requireAuth,
  uploadMiddleware.single("resume"),
  [
    body("jobDescription")
      .isString().withMessage("Job description must be text")
      .isLength({ min: 50 }).withMessage("Job description must be at least 50 characters long"),
    validateRequest
  ],
  analyzeResume,
);
analysisRoutes.get("/history", requireAuth, getAnalysisHistory);

export default analysisRoutes;

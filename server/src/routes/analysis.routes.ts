import express from "express";
import multer from "multer";
import {
  analyzeResume,
  getAnalysisHistory,
} from "../controllers/analysis.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const analysisRoutes = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

analysisRoutes.post(
  "/",
  requireAuth,
  uploadMiddleware.single("resume"),
  analyzeResume,
);
analysisRoutes.get("/history", requireAuth, getAnalysisHistory);

export default analysisRoutes;

import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/analysis.controller";
import { requireAuth } from "../middleware/auth.middleware";

const analysisRoutes = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

analysisRoutes.post("/", requireAuth, uploadMiddleware.single("resume"), analyzeResume);

export default analysisRoutes;
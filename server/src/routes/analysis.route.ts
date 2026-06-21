import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/analysis.controller";
import { protect } from "../middleware/auth.middleware";

const analysisRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

analysisRouter.post("/", protect, upload.single("resume"), analyzeResume);

export default analysisRouter;
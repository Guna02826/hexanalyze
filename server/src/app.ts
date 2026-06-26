import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { json, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import analysisRoutes from "./routes/analysis.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());
app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "",
      "https://hexanalyze.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);

export default app;

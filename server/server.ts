import "dotenv/config";
import cors from "cors";
import express, { json, Request, Response } from "express";

import { connectDB } from "./src/config/db.js";

import analysisRoutes from "./src/routes/analysis.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "",
      "https://hexanalyze.netlify.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.send("The server is working.");
});

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

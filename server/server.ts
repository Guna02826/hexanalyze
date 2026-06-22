import cors from "cors";
import { config as _config } from "dotenv";
_config({ quiet: true });

import express, { json, Request, Response } from "express";

import { connectDB } from "./src/config/db";

import analysisRoutes from "./src/routes/analysis.routes";
import authRoutes from "./src/routes/auth.routes";

const app = express();

app.use(json());

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);

app.get("/api/test", (req: Request, res: Response) => {
  res.send("The server is working.");
});

connectDB();
app.listen(3000, () => console.log("Server is running on port 3000"));

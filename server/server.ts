import cors from "cors";
import { config as _config } from "dotenv";
_config({ quiet: true });

import express, { json, Request, Response } from "express";

import { connectDB } from "./src/config/db";

import analysisRoutes from "./src/routes/analysis.routes";
import authRoutes from "./src/routes/auth.routes";

const app = express();

app.use(json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);


app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);

app.get("/api/test", (req: Request, res: Response) => {
  res.send("The server is working.");
});

connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is running."));

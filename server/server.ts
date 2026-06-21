import cors from "cors";
import { config as _config } from "dotenv";
_config({ quiet: true });

import express, { json, Request, Response } from "express";

import { connectDB } from "./src/config/db";

import analysisRouter from "./src/routes/analysis.route";
import authRouter from "./src/routes/auth.routes";

const app = express();

app.use(json());

app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/analyze", analysisRouter);

app.get("/api/test", (req: Request, res: Response) => {
  res.send("The server is working.");
});

connectDB();
app.listen(3000, () => console.log("Server is running on port 3000"));

import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { config as _config } from "dotenv";
import express, { json, Request, Response } from "express";
import { readFile, unlink } from "fs/promises";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { connectDB } from "./src/config/db";

const app = express();

app.use(json());

app.use(cors());

_config({quiet: true});

const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({});

app.get("/api/test", (req: Request, res: Response) => {
  res.send("The server is working.");
});

app.post(
  "/api/analyze",
  upload.single("resume"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json("No file uploaded.");
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json("No job description provided.");
    }

    const fileLocation = req.file.path;

    try {
      const fileBuffer = await readFile(fileLocation);
      const uint8Array = new Uint8Array(fileBuffer);
      const pdfParser = new PDFParse(uint8Array);
      const data = await pdfParser.getText();
      const resume = data.text;

      const systemInstruction =
        "You are a world-class Applicant Tracking System (ATS) and Senior Technical Recruiter with 20+ years of experience at Fortune 500 companies like Google, Amazon, and Microsoft. " +
        "You have deep expertise in evaluating resumes across software engineering, data science, product management, and all major technical disciplines. " +
        "Your evaluations are brutally honest, highly specific, and actionable. You never give generic advice. " +
        "You analyze resumes the same way enterprise ATS software does: by scanning for exact keyword matches, semantic similarity, quantifiable impact, and role-specific technical depth. " +
        "You understand that a resume must pass both the ATS keyword filter AND impress a human hiring manager. " +
        "Your job is to return a structured, data-driven evaluation in strict JSON format — no prose, no markdown, no explanations outside the JSON object.";
      const userPrompt = `
      Please compare the following resume against the job description.
      
      Resume:
      ${resume}
      Job Description:
      ${jobDescription}
      Return a JSON object with this exact structure:
      {
        "matchScore": <number between 0 and 100>,
        "matchingSkills": [<array of skills present in both the resume and job description>],
        "missingKeywords": [<array of important keywords/skills from the job description missing in the resume>],
        "suggestions": [<array of actionable recommendations to improve the resume for this job>]
      }
    `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const analysisResult = JSON.parse(response.text as string);

      res.status(200).json(analysisResult);
    } catch (error: any) {
      console.error("Analysis Error:", error);

      let clientError;
      try {
        clientError = JSON.parse(error.message);
      } catch {
        clientError = { error: error.message };
      }

      res.status(500).json(clientError);
    } finally {
      try {
        await unlink(fileLocation);
      } catch (error: any) {
        console.error("Failed to delete temp file:", error.message);
      }
    }
  },
);

connectDB();
app.listen(3000, () => console.log("Server is running on port 3000"));

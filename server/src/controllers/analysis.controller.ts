import { GoogleGenAI } from "@google/genai";
import { Response } from "express";
import { PDFParse } from "pdf-parse";
import { AuthRequest } from "../middleware/auth.middleware";
import Analysis from "../models/Analysis.model";
import { uploadToCloudinary } from "../utils/cloudinary";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResume = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: "No job description provided." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const pdfParser = new PDFParse(new Uint8Array(req.file.buffer));
    const data = await pdfParser.getText();
    const resumeText = data.text;

    const resumeUrl = await uploadToCloudinary(req.file.buffer);

    const systemInstruction =
      "You are a world-class Applicant Tracking System (ATS) and Senior Technical Recruiter with 20+ years of experience at Fortune 500 companies. " +
      "You analyze resumes the same way enterprise ATS software does. " +
      "Return a structured, data-driven evaluation in strict JSON format — no prose, no markdown.";

    const userPrompt = `
      Please compare the following resume against the job description.
      Resume:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Return a JSON object with this exact structure:
      {
        "matchScore": <number between 0 and 100>,
        "matchingSkills": [<array of strings>],
        "missingKeywords": [<array of strings>],
        "suggestions": [<array of strings>]
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

    console.log(response);

    const analysisResult = JSON.parse(response.text as string);

    const newAnalysis = await Analysis.create({
      user: req.user._id,
      resumeUrl: resumeUrl,
      jobDescription: jobDescription,
      matchScore: analysisResult.matchScore,
      matchingSkills: analysisResult.matchingSkills,
      missingKeywords: analysisResult.missingKeywords,
      suggestions: analysisResult.suggestions,
    });

    res.status(201).json(newAnalysis);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Server Error during analysis" });
  }
};

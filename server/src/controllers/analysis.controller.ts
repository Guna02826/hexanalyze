import { GoogleGenAI } from "@google/genai";
import { Response } from "express";
import { PDFParse } from "pdf-parse";
import { AuthRequest } from "../middleware/auth.middleware.js";
import Analysis from "../models/Analysis.model.js";
import User from "../models/User.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const now = new Date();
    const lastAnalysisDate = user.lastAnalysisDate ? new Date(user.lastAnalysisDate) : new Date(0);

    const isDifferentDay =
      now.getUTCFullYear() !== lastAnalysisDate.getUTCFullYear() ||
      now.getUTCMonth() !== lastAnalysisDate.getUTCMonth() ||
      now.getUTCDate() !== lastAnalysisDate.getUTCDate();

    if (isDifferentDay) {
      user.dailyAnalysisCount = 0;
      user.lastAnalysisDate = now;
    }

    const DAILY_LIMIT = 5;
    if (user.dailyAnalysisCount >= DAILY_LIMIT) {
      return res.status(429).json({ message: "Daily analysis limit reached. Please try again tomorrow." });
    }

    const pdfParser = new PDFParse(new Uint8Array(req.file.buffer));
    const parsedPdfData = await pdfParser.getText();
    const extractedResumeText = parsedPdfData.text;

    const resumeUrl = await uploadToCloudinary(req.file.buffer);

    const systemInstruction =
      "You are a world-class Applicant Tracking System (ATS) and Senior Technical Recruiter with 20+ years of experience at Fortune 500 companies. " +
      "You analyze resumes the same way enterprise ATS software does. " +
      "Return a structured, data-driven evaluation in strict JSON format — no prose, no markdown.";

    const userPrompt = `
      Please compare the following resume against the job description.
      Resume:
      ${extractedResumeText}
      
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

    const parsedAiResponse = JSON.parse(response.text as string);

    const savedAnalysisRecord = await Analysis.create({
      user: req.user._id,
      resumeUrl: resumeUrl,
      jobDescription: jobDescription,
      matchScore: parsedAiResponse.matchScore,
      matchingSkills: parsedAiResponse.matchingSkills,
      missingKeywords: parsedAiResponse.missingKeywords,
      suggestions: parsedAiResponse.suggestions,
    });

    user.dailyAnalysisCount += 1;
    await user.save();

    res.status(201).json(savedAnalysisRecord);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Server Error during analysis" });
  }
};

export const getAnalysisHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const records = await Analysis.find({ user: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(records);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json((error as Error).message);
  }
};

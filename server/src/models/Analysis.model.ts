import mongoose, { Document, Schema } from "mongoose";

export interface IAnalysis extends Document {
  user: mongoose.Types.ObjectId;
  resumeUrl: string;
  jobDescription: string;
  matchScore: number;
  matchingSkills: string[];
  missingKeywords: string[];
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Analysis =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", analysisSchema);

export default Analysis;

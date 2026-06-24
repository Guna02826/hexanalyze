import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { analyzeResume } from "../store/analysisSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const analysisSchema = z.object({
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }),
  file: z.custom<File>((v) => v instanceof File, { message: "Please upload a valid PDF document." })
         .refine((f) => f.type === "application/pdf", "File must be a PDF document."),
});

const AnalyzePage = () => {
  // 1. Local state for our form inputs
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [formError, setFormError] = useState("");

  const loadingMessages = [
    "Extracting text from your PDF...",
    "Sending data to Gemini AI...",
    "Analyzing ATS keyword matches...",
    "Generating personalized suggestions...",
    "Almost there...",
  ];

  // 2. Connect to Redux using our custom fresher-friendly hooks!
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Read our loading and error states from the analysis slice
  const { isLoading, error } = useAppSelector((state) => state.analysis);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < loadingMessages.length - 1 ? prev + 1 : prev,
        );
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  // 3. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      analysisSchema.parse({ jobDescription, file });
    } catch (err : any) {
      if (err instanceof z.ZodError) {
        setFormError(err.issues[0].message);
        return;
      }
    }

    if (!file || !jobDescription) return;

    // Create the FormData object
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    // Dispatch the thunk we just wrote!
    const resultAction = await dispatch(analyzeResume(formData));

    // If it succeeds, navigate to the results page
    if (analyzeResume.fulfilled.match(resultAction)) {
      navigate("/results");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Analyze Your Resume
      </h1>

      {/* We will build the UI inside here next */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {(error || formError) && (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold text-center">
            Error: {formError || error}
          </div>
        )}
        <label className="font-semibold text-lg text-slate-700">
          Upload your Resume (PDF only):
        </label>
        <input
          className="w-full text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
          type="file"
          accept=".pdf"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              setFile(event.target.files[0]);
            }
          }}
          disabled={isLoading}
        />
        <textarea
          className="w-full min-h-[160px] p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-400 shadow-sm"
          placeholder="Paste Job Description here..."
          name=""
          onChange={(event) => setJobDescription(event.target.value)}
          disabled={isLoading}
          required
          minLength={50}
        ></textarea>

        {isLoading && (
          <div className="text-center text-indigo-400 font-medium animate-pulse mt-2">
            {loadingMessages[loadingStep]}
          </div>
        )}

        <button
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
};

export default AnalyzePage;

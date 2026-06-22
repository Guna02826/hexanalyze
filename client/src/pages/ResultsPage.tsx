import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { RootState } from "../store/store";

const ResultsPage = () => {
  // Grab the analysis result from our global Redux store
  const { currentAnalysis } = useSelector((state: RootState) => state.analysis);

  // If there is no data (maybe the user refreshed the page directly on /results),
  // send them back to the analyze page!
  if (!currentAnalysis) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your AI Analysis</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
        >
          Analyze Another
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Score */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            ATS Match Score
          </h2>
          <div className="text-6xl font-black text-indigo-500 mb-4">
            {currentAnalysis.matchScore}%
          </div>
          <p className="text-center text-slate-500 text-sm">
            Based on the job description you provided, here is how well your
            resume matches.
          </p>
        </div>

        {/* RIGHT COLUMN: Skills & Feedback */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Missing Skills */}
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h3 className="text-lg font-bold text-red-800 mb-4">
              Missing Keywords (Add these!)
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.missingKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white text-red-600 rounded-full text-sm font-semibold shadow-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Skills */}
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">
              Matched Skills (Good job)
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white text-emerald-600 rounded-full text-sm font-semibold shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: AI Suggestions */}
      <div className="mt-6 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">
          AI Suggestions
        </h3>
        <ul className="space-y-3">
          {currentAnalysis.suggestions.map((suggestion, idx) => (
            <li key={idx} className="flex gap-3 text-indigo-800">
              <span className="text-indigo-500">👉</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsPage;

import axios from "axios";
import { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!pdfFile) {
      window.alert("Attach the resume file ");
    } else if (!jd) {
      window.alert("No JD attached");
    } else {
      const formData = new FormData();
      formData.append("resume", pdfFile);
      formData.append("jobDescription", jd);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/analyze`,
          formData,
        );
        setResult(response.data);
      } catch (error) {
        console.log((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-12">
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
          <h1 className="text-4xl font-bold text-blue-500 text-center mb-8">
            AI Job Matcher
          </h1>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="font-semibold text-lg text-slate-300">
              Upload your Resume (PDF only):
            </label>
            <input
              className="w-full text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setPdfFile(e.target.files[0]);
                }
              }}
            />
            <textarea
              className="w-full min-h-[160px] p-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 placeholder-slate-500"
              placeholder="Paste Job Description here..."
              name=""
              onChange={(e) => setJd(e.target.value)}
            ></textarea>
            <button
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

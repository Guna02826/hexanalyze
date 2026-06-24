import { useEffect } from "react";
import { fetchAnalysisHistory } from "../store/analysisSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { history, isLoading, error } = useAppSelector((state) => state.analysis);

  useEffect(() => {
    dispatch(fetchAnalysisHistory());
  }, [dispatch]);

  // Calculate Stats
  const totalAnalyses = history.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(history.reduce((sum, item) => sum + item.matchScore, 0) / totalAnalyses)
    : 0;
  const maxScore = totalAnalyses > 0
    ? Math.max(...history.map((item) => item.matchScore))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm border border-red-200">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Analyses</h3>
              <p className="mt-2 text-4xl font-extrabold text-indigo-600">{totalAnalyses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Match Score</h3>
              <p className="mt-2 text-4xl font-extrabold text-blue-600">{avgScore}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Highest Score</h3>
              <p className="mt-2 text-4xl font-extrabold text-green-600">{maxScore}%</p>
            </div>
          </div>

          {/* Recent Analyses List */}
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Analyses</h2>
          {totalAnalyses === 0 ? (
            <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500 border border-slate-200">
              No analyses yet. Head over to New Analysis to get started!
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-200">
                {history.slice(0, 5).map((analysis) => (
                  <li key={analysis._id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                          {analysis.jobDescription}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          analysis.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                          analysis.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysis.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyzePage from "./pages/AnalyzePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResultsPage from "./pages/ResultsPage";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setAccessToken } from "./store/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { withCredentials: true }
        );
        dispatch(setAccessToken(response.data.token));
      } catch (error) {
        // No valid session, proceed as unauthenticated
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-indigo-500 font-semibold animate-pulse">Initializing session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* If the user is NOT authenticated, redirect them to login */}
        <Route
          path="/"
          element={isAuthenticated ? <AnalyzePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

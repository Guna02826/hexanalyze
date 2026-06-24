import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyzePage from "./pages/AnalyzePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResultsPage from "./pages/ResultsPage";
import { useAppSelector } from "./store/hooks";

function App() {
  // We use our custom hook to check if the user is currently logged in!
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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

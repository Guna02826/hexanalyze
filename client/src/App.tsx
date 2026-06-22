import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyzePage from "./pages/AnalyzePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResultsPage from "./pages/ResultsPage";
import { useAppSelector } from "./store/hooks";

function App() {
  // We use our custom hook to check if the user is currently logged in!
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* If the user is NOT authenticated, redirect them to login */}
      <Route
        path="/"
        element={isAuthenticated ? <AnalyzePage /> : <Navigate to="/login" />}
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
  );
}

export default App;

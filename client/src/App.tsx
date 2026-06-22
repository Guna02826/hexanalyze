import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";

function App() {
  // We use Redux useSelector to check if the user is currently logged in!
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* If the user is NOT authenticated, redirect them to login */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
      />
      
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

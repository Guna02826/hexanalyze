import React from "react";

import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check the global Redux store to see if the user is authenticated
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If they are not logged in, boot them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them see the page!
  return <>{children}</>;
};

export default ProtectedRoute;

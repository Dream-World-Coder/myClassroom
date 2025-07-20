import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please login first" }}
        replace
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Unable to verify user" }}
        replace
      />
    );
  }

  return children;
};

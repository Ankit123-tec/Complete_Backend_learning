import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <div className="center">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
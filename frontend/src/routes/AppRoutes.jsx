import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Builder from "../pages/Builder";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC / AUTH ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROTECTED / DASHBOARD ROUTES ================= */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builder />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

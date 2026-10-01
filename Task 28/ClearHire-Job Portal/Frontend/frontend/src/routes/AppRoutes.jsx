import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";

import CandidateDashboard from "../pages/CandidateDashboard";
import ApplicationsPage from "../pages/ApplicationsPage";
import CandidateProfilePage from "../pages/CandidateProfilePage";
import InterviewsPage from "../pages/InterviewsPage";
import NotificationsPage from "../pages/NotificationsPage";

import RecruiterDashboard from "../pages/RecruiterDashboard";
import CompanyProfilePage from "../pages/CompanyProfilePage";
import CreateJobPage from "../pages/CreateJobPage";
import RecruiterJobsPage from "../pages/RecruiterJobsPage";
import JobApplicationsPage from "../pages/JobApplicationsPage";


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function RoleRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}


export default function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/jobs"
        element={<JobsPage />}
      />

      <Route
        path="/jobs/:jobId"
        element={<JobDetailsPage />}
      />


      {/* =========================
          CANDIDATE ROUTES
      ========================== */}

      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["candidate"]}>
            <CandidateDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <RoleRoute allowedRoles={["candidate"]}>
            <ApplicationsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <RoleRoute allowedRoles={["candidate"]}>
            <CandidateProfilePage />
          </RoleRoute>
        }
      />

      <Route
        path="/interviews"
        element={
          <RoleRoute allowedRoles={["candidate"]}>
            <InterviewsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <RoleRoute allowedRoles={["candidate"]}>
            <NotificationsPage />
          </RoleRoute>
        }
      />


      {/* =========================
          RECRUITER ROUTES
      ========================== */}

      <Route
        path="/recruiter/dashboard"
        element={
          <RoleRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/recruiter/company"
        element={
          <RoleRoute allowedRoles={["recruiter"]}>
            <CompanyProfilePage />
          </RoleRoute>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <RoleRoute allowedRoles={["recruiter"]}>
            <RecruiterJobsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/recruiter/jobs/create"
        element={
          <RoleRoute allowedRoles={["recruiter"]}>
            <CreateJobPage />
          </RoleRoute>
        }
      />

      <Route
        path="/recruiter/jobs/:jobId/applications"
        element={
          <RoleRoute allowedRoles={["recruiter"]}>
            <JobApplicationsPage />
          </RoleRoute>
        }
      />


      {/* =========================
          FALLBACK
      ========================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
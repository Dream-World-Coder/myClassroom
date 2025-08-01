import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import AuthProvider from "./contexts/AuthContext";
import DarkModeProvider from "./contexts/ThemeContext";

import HomeDashboard from "./pages/Home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import AboutNContactPage from "./pages/AboutNContact/AnC";

import AddCoursePage from "./pages/Courses/AddCourse";
import AllCourses from "./pages/Courses/AllCourses";
import CoursePage from "./pages/Courses/CoursePage";

import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";

import { ProtectedRoute } from "./components/ProtectedRoutes";

import NotFound from "./components/NotFoundPage";

export default function App() {
  // abcde1XY
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Toaster position="top-center" />
        <Router>
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/about" element={<AboutNContactPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-course"
              element={
                <ProtectedRoute>
                  <AddCoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <AllCourses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

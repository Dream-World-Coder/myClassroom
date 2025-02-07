import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import HomeDashboard from "./pages/Home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";

import AddCoursePage from "./pages/Courses/AddCourse";
import AllCourses from "./pages/Courses/AllCourses";
import CoursePage from "./pages/Courses/CoursePage";

import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import AuthProvider from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoutes";

export default function App() {
    // abcde1XY
    return (
        <AuthProvider>
            <Toaster position="top-center" />
            <Router>
                <Routes>
                    <Route path="/lp" element={<LandingPage />} />
                    <Route path="/" element={<HomeDashboard />} />

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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

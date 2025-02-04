import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomeDashboard from "./pages/Home/HomePage";
import AddCoursePage from "./pages/Courses/AddCourse";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthProvider from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoutes";

export default function App() {
    // abcde1XY
    return (
        <AuthProvider>
            <Toaster position="top-center" />
            <Router>
                <Routes>
                    <Route path="/" element={<HomeDashboard />} />
                    <Route path="/lp" element={<LandingPage />} />
                    <Route
                        path="/add-course"
                        element={
                            <ProtectedRoute>
                                <AddCoursePage />
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

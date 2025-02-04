import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state, or default to dashboard
    const from = location.state?.from?.pathname || "/";

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:5050/api/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.token);
                toast.success("Login Successful!");
                // Small delay to ensure token is set and toast is visible
                setTimeout(() => {
                    // Navigate to the intended page or dashboard
                    navigate(from, { replace: true });
                }, 300);
            } else {
                toast.error(data.error || "Login failed!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="bg-stone-900 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-lime-500 mb-6 text-center">
                    Welcome Back
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-stone-800 text-white rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-lime-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-stone-800 text-white rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-lime-500 pr-12" // Add padding for the button
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-lime-500 transition"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" /> // Eye-off icon when password is visible
                                ) : (
                                    <Eye className="w-5 h-5" /> // Eye icon when password is hidden
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-lime-500 text-black font-semibold py-3
                        rounded-lg hover:bg-lime-400 transition duration-300 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>
                <div className="text-right">
                    <a
                        href="#"
                        className="text-lime-500 text-sm hover:underline"
                    >
                        Forgot Password?
                    </a>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/register"
                            className="text-lime-500 hover:underline"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="text-gray-400 text-center">or</div>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition">
                            <img
                                src="/icons/google-icon.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Log in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

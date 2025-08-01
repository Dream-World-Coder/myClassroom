import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast } from "sonner";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || "/";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        login(data.token);
        toast.success("Registration Successful!");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 300);
      } else {
        toast.error(data.error || "Registration failed!");
      }
    } catch (error: unknown) {
      console.error("Signup Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-stone-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-lime-500 mb-6 text-center">
          Create Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className="w-full bg-stone-800 text-white rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-lime-500"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full bg-stone-800 text-white rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-lime-500"
              placeholder="Email"
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-stone-800 text-white rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-lime-500 pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-lime-500 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500 text-black font-semibold py-3 rounded-lg hover:bg-lime-400 transition duration-300 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <NavLink to="/login" className="text-lime-500 hover:underline">
              Log In
            </NavLink>
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
              Sign Up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

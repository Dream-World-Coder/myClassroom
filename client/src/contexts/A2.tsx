import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: () => Promise.resolve(),
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);

  // Memoize logout to prevent unnecessary re-renders
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  }, []);

  const login = useCallback((newToken) => {
    if (!newToken) {
      toast.error("Invalid token received");
      return;
    }
    localStorage.setItem("token", newToken);
    setToken(newToken);
    toast.success("Logged in successfully");
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/u`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else if (response.status === 404) {
        toast.error("User not found.");
        logout();
      } else {
        toast.error(`Failed to fetch user data (${response.status})`);
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Network error. Please check your connection.");
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // fetch user data when token changes
  useEffect(() => {
    let isSubscribed = true;

    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchUserData();
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isSubscribed = false;
    };
  }, [token, fetchUserData]);

  // Refresh token handler - useful for manually refreshing user data
  const refreshUser = useCallback(async () => {
    if (!token) return;
    await fetchUserData();
  }, [token, fetchUserData]);

  const contextValue = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook with error handling
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Type guard for checking if user is authenticated
const isAuthenticated = (user, token) => {
  return !!user && !!token;
};

export default AuthProvider;
export { useAuth };

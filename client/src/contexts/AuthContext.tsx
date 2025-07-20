import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import type { User } from "@/components/types";

// will use cookies later

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const login = useCallback((newToken: string | null): void => {
    if (!newToken) {
      toast.error("Invalid token received");
      return;
    }
    localStorage.setItem("token", newToken);
    setToken(newToken);
    toast.success("Logged in successfully");
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  }, []);

  const fetchUserData = useCallback(async (): Promise<void> => {
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

  // refresh token handler -> for manually refreshing user data
  const refreshUser = useCallback(async () => {
    if (!token) return;
    await fetchUserData();
  }, [token, fetchUserData]);

  const isAuthenticated = !!user && !!token;

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated,
    }),
    [user, token, loading, login, logout, refreshUser, isAuthenticated],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;

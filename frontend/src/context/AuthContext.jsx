import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_URL } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("auth_token");
            setUser(null);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("auth_token", data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      localStorage.setItem("auth_token", data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

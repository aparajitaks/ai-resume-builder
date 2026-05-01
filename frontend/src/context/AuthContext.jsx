import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

/**
 * Decodes a JWT payload (without verification — that's the server's job).
 */
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

/**
 * Check if a token is expired.
 */
const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  // Add 10s buffer for clock skew
  return Date.now() >= (payload.exp - 10) * 1000;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (accessToken && !isTokenExpired(accessToken)) {
      try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : { accessToken };
        setUser(parsedUser);
      } catch {
        setUser({ accessToken });
      }
    } else if (accessToken) {
      // Token expired — clear everything
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  const login = ({ accessToken, refreshToken, user: userData }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

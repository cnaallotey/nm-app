import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("gh_token")
  );

  const login = useCallback(async (newToken: string): Promise<boolean> => {
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      if (!res.ok) return false;
      localStorage.setItem("gh_token", newToken);
      setToken(newToken);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gh_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

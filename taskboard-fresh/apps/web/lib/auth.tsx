"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

export type AuthUser = {
  sub: string;
  username: string;
  nickname?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  /** Stub: records `username` (or the server default) as the dev user. */
  login: (username?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load session");
  return (await res.json()) as AuthUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 5 * 60_000,
    retry: false,
  });

  function currentPath() {
    if (typeof window === "undefined") return "/";
    return window.location.pathname + window.location.search;
  }

  const login = (username?: string) => {
    const params = new URLSearchParams({ returnTo: currentPath() });
    if (username) params.set("user", username);
    window.location.assign(`/api/auth/login?${params.toString()}`);
  };

  const logout = () => {
    const params = new URLSearchParams({ returnTo: "/" });
    window.location.assign(`/api/auth/logout?${params.toString()}`);
  };

  return (
    <AuthContext.Provider
      value={{ user: data ?? null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Mirror of @auth0/nextjs-auth0's useUser() so feature code is portable. */
export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used within <AuthProvider>");
  return ctx;
}

"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useUser } from "@/lib/auth";

/** Full Profile row of the logged-in user (Phase 3 implements the endpoint). */
export type Profile = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  averageRating: number;
  reviewCount: number;
  role: "USER" | "ADMIN";
  banned: boolean;
};

export function useCurrentProfile() {
  const { user, isLoading: authLoading } = useUser();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => api.get<Profile>("/api/users/me").then((r) => r.data),
    enabled: !!user,
  });

  return {
    profile: profile ?? null,
    isLoading: authLoading || (!!user && profileLoading),
  };
}

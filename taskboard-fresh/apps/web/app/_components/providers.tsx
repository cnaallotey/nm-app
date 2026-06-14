"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { initTokenGetter, type TokenPayload } from "@/lib/api";

// Teach the axios interceptor how to fetch the current token. Module scope
// so it runs exactly once when this client bundle loads.
initTokenGetter(async (): Promise<TokenPayload> => {
  const res = await fetch("/api/token", { credentials: "include" });
  if (!res.ok) return {};
  return (await res.json()) as TokenPayload;
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

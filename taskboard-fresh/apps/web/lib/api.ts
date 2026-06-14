import axios from "axios";

/**
 * Token payload returned by /api/token.
 *  - accessToken: real JWT (Auth0 mode) — sent as `Authorization: Bearer`
 *  - devUser: stub username — sent as `x-dev-user` (Express stub middleware)
 */
export type TokenPayload = {
  accessToken?: string | null;
  devUser?: string | null;
};

// Module-level getter, initialized once in <Providers> (client only).
let getTokenFn: (() => Promise<TokenPayload>) | null = null;

export function initTokenGetter(fn: () => Promise<TokenPayload>) {
  getTokenFn = fn;
}

// Empty baseURL → same-origin: requests hit `/api/*` and the Next
// `afterFiles` rewrite proxies them to the Express API (single origin,
// no CORS in dev). Override via NEXT_PUBLIC_API_URL to bypass the proxy.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (!getTokenFn) return config;
  try {
    const { accessToken, devUser } = await getTokenFn();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (devUser) {
      config.headers.set("x-dev-user", devUser);
    }
  } catch {
    // No token → unauthenticated request (public endpoints still work).
  }
  return config;
});

export default api;

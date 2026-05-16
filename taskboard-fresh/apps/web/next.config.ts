import path from "path";
import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // Monorepo: yarn workspaces hoist node_modules to the repo root, so the
  // Turbopack workspace root must be the repo root (two levels up from
  // apps/web) — not apps/web itself, or `next` can't be resolved.
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  async rewrites() {
    return {
      // `beforeFiles` would shadow our own route handlers. Using `afterFiles`
      // means Next's filesystem routes win first — so the Auth0 shims at
      // `app/api/auth/[...auth0]` and `app/api/token` are served by Next,
      // and every *other* `/api/*` request falls through to the Express API.
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${API_URL}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;

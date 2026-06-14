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
    // `fallback` runs AFTER both static and dynamic filesystem routes, so
    // every Next-owned `/api/*` route handler wins first — including the
    // *dynamic* `app/api/auth/[...auth0]` catch-all (which `afterFiles`
    // would wrongly shadow, since afterFiles is evaluated before dynamic
    // routes). Anything with no Next route falls through to Express.
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${API_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

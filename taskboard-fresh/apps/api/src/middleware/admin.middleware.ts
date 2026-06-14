import type { RequestHandler } from "express";

/**
 * Gate admin routes. Must run AFTER requireAuth (needs req.profile).
 *
 * Deviation from implementation.md: it checks `req.profile.role` (DB truth)
 * rather than the Auth0 `https://taskboard.app/role` JWT claim. This makes
 * admin access work identically in stub and auth0 modes and keeps the DB as
 * the single source of truth for role. (The Auth0 Post-Login Action still
 * sets the claim for future optimistic client-side checks.)
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.profile?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

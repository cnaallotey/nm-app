import type { RequestHandler } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { prisma } from "../lib/prisma";

const AUTH_MODE = process.env.AUTH_MODE ?? "stub";
const DEV_DEFAULT_USERNAME = process.env.DEV_DEFAULT_USERNAME ?? "alice";

/**
 * Real Auth0 JWT verification. Only active when AUTH_MODE=auth0.
 * In stub mode this is a pass-through so the same `requireAuth` array works
 * unchanged — the real verifier drops in with a single env flip.
 */
const verifyToken: RequestHandler =
  AUTH_MODE === "auth0"
    ? (auth({
        audience: process.env.AUTH0_AUDIENCE,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        tokenSigningAlg: "RS256",
      }) as unknown as RequestHandler)
    : (_req, _res, next) => next();

/**
 * Resolve `req.profile`.
 *  - auth0 mode: look up by `auth0UserId` from the verified JWT `sub`.
 *  - stub  mode: look up by username from the `x-dev-user` header,
 *                falling back to DEV_DEFAULT_USERNAME.
 */
const attachProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile =
      AUTH_MODE === "auth0"
        ? await prisma.profile.findUnique({
            where: { auth0UserId: req.auth?.payload.sub as string },
          })
        : await prisma.profile.findUnique({
            where: {
              username:
                (req.header("x-dev-user") as string) || DEV_DEFAULT_USERNAME,
            },
          });

    if (!profile) return res.status(404).json({ error: "Profile not found" });
    if (profile.banned)
      return res.status(403).json({ error: "Account suspended" });

    req.profile = profile;
    next();
  } catch (err) {
    next(err);
  }
};

/** Use on every protected route: `router.post("/", ...requireAuth, handler)`. */
export const requireAuth: RequestHandler[] = [verifyToken, attachProfile];

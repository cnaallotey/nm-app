import type { RequestHandler } from "express";

/**
 * Placeholder for endpoints whose service logic lands in a later build phase.
 * Keeps routing/auth wiring complete and the server bootable today.
 */
export const notImplemented = (label: string): RequestHandler => {
  const h: RequestHandler = (_req, res) =>
    res.status(501).json({ error: `Not implemented yet: ${label}` });
  return h;
};

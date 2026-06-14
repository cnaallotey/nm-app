import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

router.get("/", ...requireAuth, notImplemented("GET /api/notifications"));
router.get(
  "/unread-count",
  ...requireAuth,
  notImplemented("GET /api/notifications/unread-count"),
);
router.patch(
  "/read-all",
  ...requireAuth,
  notImplemented("PATCH /api/notifications/read-all"),
);
router.patch(
  "/:id/read",
  ...requireAuth,
  notImplemented("PATCH /api/notifications/:id/read"),
);

export default router;

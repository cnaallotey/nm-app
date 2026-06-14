import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

router.post("/", ...requireAuth, notImplemented("POST /api/applications"));
router.get(
  "/task/:taskId",
  ...requireAuth,
  notImplemented("GET /api/applications/task/:taskId"),
);
router.patch(
  "/:id/accept",
  ...requireAuth,
  notImplemented("PATCH /api/applications/:id/accept"),
);
router.patch(
  "/:id/reject",
  ...requireAuth,
  notImplemented("PATCH /api/applications/:id/reject"),
);

export default router;

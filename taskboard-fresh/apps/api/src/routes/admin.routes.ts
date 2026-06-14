import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

// Every admin route: authenticated AND role=ADMIN.
router.use(...requireAuth, requireAdmin);

router.get("/stats", notImplemented("GET /api/admin/stats"));
router.get("/users", notImplemented("GET /api/admin/users"));
router.patch("/users/:id/ban", notImplemented("PATCH /api/admin/users/:id/ban"));
router.patch(
  "/users/:id/unban",
  notImplemented("PATCH /api/admin/users/:id/unban"),
);
router.get("/tasks", notImplemented("GET /api/admin/tasks"));
router.delete("/tasks/:id", notImplemented("DELETE /api/admin/tasks/:id"));

export default router;

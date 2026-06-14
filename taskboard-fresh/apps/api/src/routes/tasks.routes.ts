import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

// Public
router.get("/", notImplemented("GET /api/tasks (list + search + filters)"));
router.get("/:id", notImplemented("GET /api/tasks/:id"));

// Auth required
router.post("/", ...requireAuth, notImplemented("POST /api/tasks"));
router.patch("/:id", ...requireAuth, notImplemented("PATCH /api/tasks/:id"));
router.delete("/:id", ...requireAuth, notImplemented("DELETE /api/tasks/:id"));

export default router;

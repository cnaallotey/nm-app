import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

router.get("/", notImplemented("GET /api/users (directory)"));
router.get("/me", ...requireAuth, notImplemented("GET /api/users/me"));
router.post("/profile", ...requireAuth, notImplemented("POST /api/users/profile"));
router.patch("/me", ...requireAuth, notImplemented("PATCH /api/users/me"));
// Keep `/:username` last so it doesn't shadow `/me`.
router.get("/:username", notImplemented("GET /api/users/:username"));

export default router;

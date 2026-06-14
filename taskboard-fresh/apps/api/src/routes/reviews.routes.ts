import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { notImplemented } from "../lib/notimpl";

const router = Router();

router.post("/", ...requireAuth, notImplemented("POST /api/reviews"));
router.get(
  "/user/:profileId",
  notImplemented("GET /api/reviews/user/:profileId"),
);

export default router;

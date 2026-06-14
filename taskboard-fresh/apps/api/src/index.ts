import path from "path";
import dotenv from "dotenv";

// Single source of truth for env: the repo-root .env (shared with the web app).
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./types/express";

import { requireAuth } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import taskRoutes from "./routes/tasks.routes";
import applicationRoutes from "./routes/applications.routes";
import reviewRoutes from "./routes/reviews.routes";
import userRoutes from "./routes/users.routes";
import notificationRoutes from "./routes/notifications.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    authMode: process.env.AUTH_MODE ?? "stub",
    emailMode: process.env.EMAIL_MODE ?? "stub",
  }),
);

// Phase 2 auth-flow verification: echoes the resolved profile. Proves the
// web → token → header → Express requireAuth → req.profile chain end-to-end.
app.get("/api/whoami", ...requireAuth, (req, res) => {
  res.json({ profile: req.profile });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

const port = Number(process.env.API_PORT) || 4000;
app.listen(port, () => {
  console.log(
    `API on :${port}  ·  auth=${process.env.AUTH_MODE ?? "stub"}  ·  email=${
      process.env.EMAIL_MODE ?? "stub"
    }`,
  );
});

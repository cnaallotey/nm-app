import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors";

// 4-arg signature is required for Express to treat this as an error handler.
export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // express-oauth2-jwt-bearer throws errors carrying a `status`.
  if (err && typeof err === "object" && "status" in err && "code" in err) {
    const status = Number((err as { status: unknown }).status) || 401;
    return res
      .status(status)
      .json({ error: (err as { message?: string }).message ?? "Unauthorized" });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Resource already exists" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Resource not found" });
    }
  }

  console.error("[unhandled]", err);
  return res.status(500).json({ error: "Internal server error" });
};

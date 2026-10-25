import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Normalize Multer/filesystem upload failures into predictable API responses.
// Client errors -> 4xx with a safe message; genuine filesystem failures -> 500
// without internal paths, stack traces, or secrets. Never sends twice.
export const handleUploadError = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!error) {
    next();
    return;
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "File is too large" });
      return;
    }

    if (
      error.code === "LIMIT_UNEXPECTED_FILE" ||
      error.code === "LIMIT_FILE_COUNT" ||
      error.code === "LIMIT_PART_COUNT"
    ) {
      res.status(400).json({ message: "Unexpected upload field" });
      return;
    }

    res.status(400).json({ message: "File upload failed" });
    return;
  }

  if (error instanceof Error) {
    const message = error.message ?? "";

    // Known validation messages from our fileFilter callbacks.
    if (
      message.includes("Only JPG") ||
      message.includes("is not allowed")
    ) {
      res.status(400).json({ message });
      return;
    }

    // Filesystem / directory failures: generic 500, no internal details.
    if (
      (error as NodeJS.ErrnoException).code === "ENOENT" ||
      message.includes("upload")
    ) {
      res.status(500).json({ message: "File storage unavailable" });
      return;
    }
  }

  next(error);
};

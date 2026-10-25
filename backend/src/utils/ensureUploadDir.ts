import fs from "fs";
import path from "path";

// Single source of truth for on-disk upload destinations.
// All paths stay inside <project>/uploads to preserve existing URL conventions.
export const profileUploadPath = path.join(process.cwd(), "uploads");

export const chatUploadPath = path.join(process.cwd(), "uploads", "chat");

export const ensureUploadDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

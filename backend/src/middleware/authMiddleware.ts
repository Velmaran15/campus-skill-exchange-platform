import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    // 1️⃣ Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    // 3️⃣ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Move to controller

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token failed" });
  }
};

export const optionalProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token? Continue as guest.
    if (!token) {
      return next();
    }

    // Token exists, verify it
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    // Invalid token? Continue as guest.
    next();
  }
};
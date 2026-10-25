import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { initializeSocket } from "./socket/socket";
import User from "./models/User";
import Conversation from "./models/Conversation";

import authRoutes from "./routers/authRouters";
import connectDB from "./config/db";
import skillRoutes from "./routers/skillRouters";
import sessionRoutes from "./routers/sessionRouters";
import userRoutes from "./routers/userRouters";
import notificationRoutes from "./routers/notificationRoutes";
import path from "path";

import "./services/emailService";
import emailRoutes from "./routers/emailRoutes";

import conversationRoutes from "./routers/conversationRoutes";
import messageRoutes from "./routers/messageRoutes";


const app = express();
const httpServer = createServer(app);
connectDB();


const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
initializeSocket(io);

// Authenticate every Socket.IO connection with the existing JWT mechanism.
// Token is supplied via `auth.token` (same JWT as REST `Authorization: Bearer`).
// No token value is logged.
io.use(async (socket, next) => {
  try {
    const token = (socket.handshake.auth as { token?: string } | undefined)?.token;

    if (!token) {
      return next(new Error("Not authorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("Not authorized"));
    }

    socket.data.userId = user._id.toString();

    next();
  } catch {
    return next(new Error("Not authorized"));
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join_conversation", async (conversationId: string) => {
    try {
      const userId: string | undefined = socket.data.userId;

      if (!userId) {
        socket.emit("error", { message: "Not authorized" });
        return;
      }

      if (typeof conversationId !== "string" || !mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit("error", { message: "Invalid conversation" });
        return;
      }

      // Same membership rule as messageController: tutor OR learner.
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        socket.emit("error", { message: "Conversation not found" });
        return;
      }

      const isParticipant =
        conversation.tutor.toString() === userId ||
        conversation.learner.toString() === userId;

      if (!isParticipant) {
        socket.emit("error", { message: "Not authorized" });
        return;
      }

      socket.join(conversationId);

      console.log(
        `👥 Socket ${socket.id} joined conversation ${conversationId}`
      );
    } catch {
      socket.emit("error", { message: "Failed to join conversation" });
    }
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);

    console.log(
      `👋 Socket ${socket.id} left conversation ${conversationId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email", emailRoutes);

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Centralized fallback error handler (C7): catches Multer/filesystem errors
// that escape route-level handling. Never leaks paths, stacks, or secrets.
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.name === "MulterError" || err?.code === "ENOENT") {
    const { handleUploadError } = require("./middleware/uploadErrorMiddleware") as typeof import("./middleware/uploadErrorMiddleware");
    return handleUploadError(err, _req, res, next);
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
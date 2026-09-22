import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket";

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


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
initializeSocket(io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);

    console.log(
      `👥 Socket ${socket.id} joined conversation ${conversationId}`
    );
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
app.use(cors());
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

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
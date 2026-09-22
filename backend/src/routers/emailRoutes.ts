import express from "express";
import { testEmail } from "../controllers/emailController";

const router = express.Router();

router.post("/test", testEmail);

export default router;
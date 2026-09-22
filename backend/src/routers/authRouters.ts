import express from "express";
import { registerUser , loginUser  } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, async (req: any, res) => {
  res.json(req.user);
});

export default router;
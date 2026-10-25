import express from "express";
import { registerUser , loginUser , updateProfile , deleteAccount  } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, async (req: any, res) => {
  res.json(req.user);
});
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

export default router;
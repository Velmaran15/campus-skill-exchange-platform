import express from "express";
import { addSkill , getSkills, getMySkills, deleteSkill, updateSkill } from "../controllers/skillController";
import { protect, optionalProtect } from "../middleware/authMiddleware";
import { isTutor } from "../middleware/roleMiddleware";


const router = express.Router();

router.get("/", optionalProtect, getSkills);
router.get("/my", protect, getMySkills);
router.delete("/:id", protect, deleteSkill);
router.post("/", protect, isTutor, addSkill);
router.put("/:id", protect, isTutor, updateSkill);

export default router;
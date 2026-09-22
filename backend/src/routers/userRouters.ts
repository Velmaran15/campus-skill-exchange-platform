import express from "express";
import { getTopTutors, getTutorProfile, updateBio, uploadProfileImage, saveSkill, unSaveSkill, getSavedSkills } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { isLearner } from "../middleware/roleMiddleware";


const router = express.Router();

router.get("/top", getTopTutors);
router.put("/bio", protect, updateBio);
router.put("/profile-image", protect, upload.single("image"), uploadProfileImage);
router.post("/save-skill/:skillId", protect, isLearner, saveSkill);
router.delete("/save-skill/:skillId", protect, isLearner, unSaveSkill);
router.get("/saved-skills", protect, isLearner, getSavedSkills);
router.get("/:id", getTutorProfile);

export default router;
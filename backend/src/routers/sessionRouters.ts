import express from "express";
import {
    requestSession,
    acceptSession,
    rejectSession,
    getTutorSessions,
    getLearnerSessions,
    completeSession,
    rateSession,
    cancelSession,
    getMyReviews
} from "../controllers/sessionController";
import { protect } from "../middleware/authMiddleware";
import { isLearner } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", protect, requestSession);

router.post("/:id/accept", protect, acceptSession);
router.post("/:id/reject", protect, rejectSession);
router.delete("/:id/cancel", protect, cancelSession);

router.get("/tutor", protect, getTutorSessions);
router.get("/learner", protect, getLearnerSessions);

router.put("/:id/complete", protect, completeSession);
router.put("/:id/rate", protect, rateSession);
router.get("/my-reviews", protect, isLearner, getMyReviews);
export default router;
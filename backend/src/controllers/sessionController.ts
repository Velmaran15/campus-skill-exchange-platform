import { Request, Response } from "express";
import Session from "../models/Session";
import Skill from "../models/Skill";
import User from "../models/User";
import { createNotification } from "../utils/createNotification";

import { sendEmail } from "../services/emailService";
import { sessionAcceptedEmail, sessionRequestEmail, sessionRejectedEmail } from "../services/emailTemplates";

import Conversation from "../models/Conversation";

interface AuthRequest extends Request {
    user?: any;
}


export const requestSession = async (req: AuthRequest, res: Response) => {
    try {
        const { skillId } = req.body;

        // 1. Find skill
        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        // 2. Find tutor
        const tutor = await User.findById(skill.tutor);

        if (!tutor) {
            return res.status(404).json({
                message: "Tutor not found"
            });
        }

        // 3. Find learner
        const learner = await User.findById(req.user._id);

        if (!learner) {
            return res.status(404).json({
                message: "Learner not found"
            });
        }

        // 4. Create session
        const session = await Session.create({
            tutor: skill.tutor,
            learner: req.user._id,
            skill: skillId,
            requestedAt: new Date()
        });

        // 5. Create in-app notification
        await createNotification({
            receiver: skill.tutor.toString(),
            sender: req.user._id.toString(),
            type: "session_request",
            title: "New Session Request",
            message: `${req.user.name} requested a session for "${skill.skillName}".`,
            link: "/profile"
        });

        try {
            const html = sessionRequestEmail({
                tutorName: tutor.name,
                learnerName: learner.name,
                skillName: skill.skillName
            });

            await sendEmail({
                to: tutor.email,
                subject: "New Session Request - SkillX",
                html
            });

            console.log("✅ Session request email sent to tutor");

        } catch (emailError) {
            console.error(
                "⚠️ Session created, but tutor email could not be sent:",
                emailError
            );
        }

        // 7. Return session
        return res.status(201).json(session);

    } catch (error) {
        console.error("Request session error:", error);

        return res.status(500).json({
            message: "Failed to request session"
        });
    }
};

export const acceptSession = async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate("learner", "name email")
            .populate("tutor", "name email")
            .populate("skill", "skillName");

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const tutor = session.tutor as any;
        const learner = session.learner as any;
        const skill = session.skill as any;

        // Only tutor can accept
        if (tutor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        // Update session
        session.status = "accepted";
        session.acceptedAt = new Date();

        await session.save();

        // Create conversation for tutor and learner
        let conversation = await Conversation.findOne({
            session: session._id,
        });

        if (!conversation) {
            conversation = await Conversation.create({
                tutor: tutor._id,
                learner: learner._id,
                session: session._id,
            });
        }

        // Create in-app notification
        await createNotification({
            receiver: learner._id.toString(),
            sender: tutor._id.toString(),
            type: "session_accepted",
            title: "Session Accepted",
            message: `Your session request has been accepted by ${tutor.name}.`,
            link: "/profile"
        });

        // Send email
        try {
            const email = sessionAcceptedEmail(
                learner.name,
                tutor.name,
                skill.skillName
            );

            await sendEmail({
                to: learner.email,
                subject: email.subject,
                html: email.html
            });

        } catch (emailError) {
            // Email failure should NOT cancel acceptance
            console.error(
                "❌ Acceptance email failed:",
                emailError
            );
        }

        return res.json({
            success: true,
            message: "Session accepted successfully",
            session,
            conversation
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to accept session"
        });
    }
};


export const rejectSession = async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate("learner", "name email")
            .populate("tutor", "name email")
            .populate("skill", "skillName");

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const tutor = session.tutor as any;
        const learner = session.learner as any;
        const skill = session.skill as any;

        // Only tutor can reject
        if (tutor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        // Update session
        session.status = "rejected";

        await session.save();

        // Create in-app notification
        await createNotification({
            receiver: learner._id.toString(),
            sender: tutor._id.toString(),
            type: "session_rejected",
            title: "Session Rejected",
            message: `Your session request has been rejected by ${tutor.name}.`,
            link: "/search"
        });

        // Send email
        try {
            const email = sessionRejectedEmail(
                learner.name,
                tutor.name,
                skill.skillName
            );

            await sendEmail({
                to: learner.email,
                subject: email.subject,
                html: email.html
            });

        } catch (emailError) {
            // Email failure should NOT cancel rejection
            console.error(
                "❌ Rejection email failed:",
                emailError
            );
        }

        return res.json({
            success: true,
            message: "Session rejected successfully",
            session
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to reject session"
        });
    }
};
export const cancelSession = async (req: any, res: Response) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (
            session.learner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await session.deleteOne();

        res.json({
            message: "Request cancelled"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel request"
        });
    }
};

export const getTutorSessions = async (req: any, res: Response) => {
    try {
        const sessions = await Session.find({
            tutor: req.user._id
        })
            .populate("learner", "name email")
            .populate("skill", "skillName level");

        res.json(sessions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch tutor sessions" });
    }
};

export const getLearnerSessions = async (req: any, res: Response) => {
    try {
        const sessions = await Session.find({
            learner: req.user._id
        })
            .populate("tutor", "name email")
            .populate("skill", "skillName level");

        res.json(sessions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch learner sessions" });
    }
};

export const completeSession = async (req: any, res: Response) => {
    try {
        const session = await Session.findById(req.params.id);

        // 1️⃣ Check session exists
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // 2️⃣ Only tutor can mark complete
        if (session.tutor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 3️⃣ Update status
        session.status = "completed";
        session.completedAt = new Date();

        await session.save();

        res.json({
            message: "Session completed",
            session
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to complete session" });
    }
};

export const rateSession = async (req: any, res: Response) => {
    try {
        const { rating, feedback } = req.body;

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Only learner can rate
        if (session.learner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Only completed session can be rated
        if (session.status !== "completed") {
            return res.status(400).json({ message: "Session not completed yet" });
        }

        // 🔥 4️⃣ Prevent multiple rating (ADD HERE)
        if (session.rating) {
            return res.status(400).json({ message: "Already rated" });
        }

        // Save session rating
        session.rating = rating;
        session.feedback = feedback;
        await session.save();

        // 🔥 Update tutor rating
        const ratedSessions = await Session.find({
            tutor: session.tutor,
            rating: { $exists: true }
        });

        const averageRating =
            ratedSessions.reduce(
                (sum, s) => sum + (s.rating || 0),
                0
            ) / ratedSessions.length;

        await User.findByIdAndUpdate(
            session.tutor,
            {
                rating: averageRating,
                totalSessions: ratedSessions.length
            }
        );

        res.json(session);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to rate session" });
    }
};

export const getMyReviews = async (req: any, res: any) => {
    try {
        const learnerId = req.user._id;

        const reviews = await Session.find({
            learner: learnerId,
            status: "completed",
            rating: { $exists: true, $ne: null }
        })
            .populate("tutor", "name profileImage rating")
            .populate("skill", "skillName")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};
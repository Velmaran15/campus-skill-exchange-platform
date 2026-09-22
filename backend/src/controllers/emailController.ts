import { Request, Response } from "express";
import { sendEmail } from "../services/emailService";
import { sessionRequestEmail } from "../services/emailTemplates";

export const testEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const html = sessionRequestEmail({
            tutorName: "Test Tutor",
            learnerName: "Test Learner",
            skillName: "JavaScript",
        });

        await sendEmail({
            to: email,
            subject: "New Session Request - SkillX",
            html,
        });

        return res.status(200).json({
            success: true,
            message: "Test email sent successfully",
        });

    } catch (error) {
        console.error("Test email error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send test email",
        });
    }
};
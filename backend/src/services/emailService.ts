import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Email Server Error:", error);
    } else {
        console.log("✅ Gmail SMTP Connected");
    }
});

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({
    to,
    subject,
    html,
}: SendEmailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"SkillX" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("📧 Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};
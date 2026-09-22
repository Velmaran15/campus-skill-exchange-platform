
// sessionRequestEmail function is defined below
export const sessionRequestEmail = ({ tutorName, learnerName, skillName, }: { tutorName: string; learnerName: string; skillName: string; }) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>New Session Request - SkillX</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    ">

        <!-- Header -->
        <div style="
            background-color: #18181b;
            padding: 28px;
            text-align: center;
        ">

            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
            ">
                Skill<span style="color: #f5a623;">X</span>
            </h1>

        </div>

        <!-- Content -->
        <div style="padding: 32px;">

            <h2 style="
                color: #18181b;
                margin-top: 0;
            ">
                New Session Request 📩
            </h2>

            <p style="
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            ">
                Hi <strong>${tutorName}</strong>,
            </p>

            <p style="
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            ">
                <strong>${learnerName}</strong> has requested a learning
                session with you.
            </p>

            <!-- Session Details -->
            <div style="
                background-color: #f8f8f8;
                border-radius: 12px;
                padding: 20px;
                margin: 24px 0;
            ">

                <p style="margin: 8px 0; color: #555;">
                    <strong>Skill:</strong> ${skillName}
                </p>

                <p style="margin: 8px 0; color: #555;">
                    <strong>Learner:</strong> ${learnerName}
                </p>

            </div>

            <p style="
                color: #555555;
                line-height: 1.6;
            ">
                Please open your SkillX dashboard to review the request
                and accept or reject the session.
            </p>

            <!-- Button -->
            <div style="
                text-align: center;
                margin: 30px 0;
            ">

                <a
                    href="${process.env.CLIENT_URL}/dashboard/tutor"
                    style="
                        display: inline-block;
                        background-color: #f5a623;
                        color: #18181b;
                        text-decoration: none;
                        font-weight: bold;
                        padding: 14px 28px;
                        border-radius: 10px;
                    "
                >
                    View Session Request
                </a>

            </div>

            <p style="
                color: #999999;
                font-size: 13px;
                text-align: center;
                margin-top: 30px;
            ">
                This email was sent automatically by SkillX.
            </p>

        </div>

    </div>

</body>
</html>
`;
};

// sessionAcceptedEmail function is defined below
export const sessionAcceptedEmail = (learnerName: string, tutorName: string, skillName: string) => {
    return {
        subject: "Session Accepted - SkillX",

        html: `
            <h2>Session Accepted 🎉</h2>

            <p>Hello ${learnerName},</p>

            <p>
                Your session request for
                <strong>${skillName}</strong>
                has been accepted by
                <strong>${tutorName}</strong>.
            </p>

            <p>
                You can now continue with your learning session.
            </p>

            <p>
                Thanks,<br>
                SkillX Team
            </p>
        `
    };
};

// Session Rejected Email Template
export const sessionRejectedEmail = (learnerName: string, tutorName: string, skillName: string) => {
    return {
        subject: "Session Request Rejected - SkillX",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f8f8f8;
                border-radius: 12px;
            ">

                <h2 style="color: #111;">
                    Session Request Update
                </h2>

                <p>Hello ${learnerName},</p>

                <p>
                    Your session request for
                    <strong>${skillName}</strong>
                    has been rejected by
                    <strong>${tutorName}</strong>.
                </p>

                <p>
                    Don't worry! You can explore other tutors
                    and request another session on SkillX.
                </p>

                <a
                    href="${process.env.CLIENT_URL}/search"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background: #f59e0b;
                        color: #111;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                    "
                >
                    Explore Tutors
                </a>

                <p style="margin-top: 30px; color: #666;">
                    Thanks,<br>
                    SkillX Team
                </p>

            </div>
        `
    };
};
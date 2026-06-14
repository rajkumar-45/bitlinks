import nodemailer from "nodemailer";

export async function sendResetOtpEmail(email, otp) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || '"Bitlinks" <noreply@bitlinks.com>';

    let transporter;

    if (smtpHost && smtpUser && smtpPass) {
        console.log("Using custom SMTP configuration for email delivery");
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort, 10),
            secure: smtpPort == 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
    } else {
        console.log("No custom SMTP configured. Creating Ethereal testing account...");
        try {
            // Create a test SMTP service account from ethereal.email
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } catch (etherealError) {
            console.error("Failed to initialize Ethereal SMTP server:", etherealError);
            return {
                sent: false,
                previewUrl: null,
                error: "SMTP service offline"
            };
        }
    }

    const mailOptions = {
        from: smtpFrom,
        to: email,
        subject: "Your Bitlinks Password Reset OTP Code",
        text: `You requested a password reset. Your 6-digit OTP code is: ${otp}. It is valid for 15 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
                <h2 style="color: #7c3aed; text-align: center;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your Bitlinks account. Use the following 6-digit One-Time Password (OTP) to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #7c3aed; background-color: #f5f3ff; padding: 10px 20px; border-radius: 8px; border: 1px dashed #c084fc;">
                        ${otp}
                    </span>
                </div>
                <p>This OTP is valid for <strong>15 minutes</strong>. If you did not request this password reset, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Bitlinks URL Shortener</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        let previewUrl = null;
        if (!smtpHost) {
            previewUrl = nodemailer.getTestMessageUrl(info);
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", previewUrl);
        }
        return {
            sent: true,
            previewUrl,
            messageId: info.messageId
        };
    } catch (error) {
        console.error("Error sending email via SMTP:", error);
        return {
            sent: false,
            previewUrl: null,
            error: error.message
        };
    }
}

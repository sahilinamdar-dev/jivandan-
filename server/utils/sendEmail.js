const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { name: "TrustAid", email: process.env.EMAIL_FROM };
        sendSmtpEmail.to = [{ email: to }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendOTPEmail = async (to, otp) => {
    const subject = "Verification OTP - TrustAid";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Verify your account</h2>
            <p>Your OTP for registration is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
        </div>
    `;
    await sendEmail(to, subject, htmlContent);
};

const sendResetPasswordEmail = async (to, token) => {
    const subject = "Reset Password - TrustAid";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset your password</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${token}" style="display: inline-block; padding: 10px 20px; background-color: #ff4d4d; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
    await sendEmail(to, subject, htmlContent);
};

const sendResetOTPEmail = async (to, otp) => {
    const subject = "Reset Password OTP - TrustAid";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset your password</h2>
            <p>Your OTP for password reset is: <strong style="font-size: 24px;">${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
    await sendEmail(to, subject, htmlContent);
};

module.exports = { sendEmail, sendOTPEmail, sendResetPasswordEmail, sendResetOTPEmail };

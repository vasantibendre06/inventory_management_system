import "../config/env.js";
import nodemailer from "nodemailer";

function getTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export async function sendOtpEmail(email, otp) {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: `"WinRender IMS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP for Password Setup",

        html: `
            <h2>WinRender IMS</h2>

            <p>Your One-Time Password is:</p>

            <h1>${otp}</h1>

            <p>
                This OTP is valid for
                <strong>10 minutes</strong>.
            </p>

            <p>
                If you did not request this,
                please ignore this email.
            </p>
        `,
    });
}
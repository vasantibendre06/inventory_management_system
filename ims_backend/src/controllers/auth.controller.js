import { loginUser, resetPasswordService } from "../services/auth.service.js";
import {loginCookieOptions, resetCookieOptions} from "../config/cookieOptions.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required." 
            });
        }

        const result = await loginUser(email, password);

        if (result.mustResetPassword) {
            res.cookie(
                "resetToken",
                result.resetToken,
                resetCookieOptions
            );

            return res.status(200).json({
                success: true,
                mustResetPassword: true,
                message: "Please reset your password to continue.",
            });
        }

        //console.log("Cookie value:", result.token);
        res.cookie("token", result.token, loginCookieOptions);

        return res.status(200).json({
            success: true,
            mustResetPassword: false,
            user: result.user,
        });
    } catch (err) {
        const statusCode = err.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: err.message || "Something went wrong.",
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { newPassword, confirmPassword } = req.body;

        if(!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Both password fields are required."
            });           
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        const email = req.user.email;

        await resetPasswordService(email, newPassword);

        res.clearCookie(
            "resetToken",
            resetCookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully. Please log in again."
        });

    } catch (error) {
        const statusCode = err.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: err.message || "Something went wrong."
        });
    }
}
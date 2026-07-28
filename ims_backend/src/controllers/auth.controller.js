import { loginUser, resetPasswordService, activateAccountService, forgotPasswordService } from "../services/auth.service.js";
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
                email: result.email,
                message: "Please reset your password to continue.",
            });
        }

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
        const { email, otp, newPassword, confirmPassword } = req.body;

        if(!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });           
        }

        const result = await resetPasswordService(
            email,
            otp,
            newPassword,
            confirmPassword
        );

        return res.status(200).json(result);

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Something went wrong."
        });
    }
}


export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        await forgotPasswordService(email);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Something went wrong."
        });
    }
}



export async function activateAccount(req, res) {
    try {
        const {
            email,
            otp,
            newPassword,
            confirmPassword,
        } = req.body;

        const {
            token,
            user,
            message,
        } = await activateAccountService(
            email,
            otp,
            newPassword,
            confirmPassword
        );

        res.cookie("token", token, loginCookieOptions);

        return res.status(200).json({
            success: true,
            message,
            user,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}



export const logout = (req, res) => {
    res.clearCookie("token", loginCookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
};
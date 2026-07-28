import bcrypt from "bcrypt";
import { findCredentialByEmail, updatePassword, getPasswordHash } from "../repository/credential.repository.js";
import { findUserByEmail, touchLastLogin, savePasswordToken, getPasswordToken, clearPasswordToken, findCredentialsByEmail  } from "../repository/user.repository.js";
import generateLoginToken from "../utils/jwt/loginToken.js";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp.js";
import { PASSWORD_TOKEN_TYPE, AUTH } from "../constants/auth.constants.js";
import {validatePassword} from "../utils/validators/password.validator.js"
import {AppError} from "../utils/AppError.js";
import { sendOtpEmail } from "./email.service.js";

const ALLOWED_DOMAIN = AUTH.COMPANY_DOMAIN

export async function loginUser(email, password) {
    // 1. Domain restriction (enable in production)
    // if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
    //     throw new AppError(
    //         403,
    //         "Only company email addresses are allowed to log in."
    //     );
    // }

    // 2. Find credentials
    const credential = await findCredentialByEmail(email);

    if (!credential) {
        throw new AppError(401, "Invalid email or password.");
    }

    // 3. First-time login → Skip password verification
    if (credential.must_reset_password) {
        const otp = generateOtp();
        const otpHash = hashOtp(otp);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await savePasswordToken(
            email,
            otpHash,
            expiresAt,
            PASSWORD_TOKEN_TYPE.ACTIVATION
        );

        await sendOtpEmail(email, otp);

        return {
            mustResetPassword: true,
            email,
        };
    }

    // 4. Normal login → Verify password
    const isMatch = await bcrypt.compare(
        password,
        credential.password
    );

    if (!isMatch) {
        throw new AppError(401, "Invalid email or password.");
    }

    // 5. Get user
    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError(
            500,
            "Credential exists but no matching user profile was found."
        );
    }

    // 6. Update last login
    await touchLastLogin(email);

    // 7. Generate JWT
    const token = generateLoginToken(user);

    return {
        mustResetPassword: false,
        token,
        user,
    };
}



export async function forgotPasswordService(email) {
    const credential = await findCredentialByEmail(email);

    if(!credential) {
        throw new AppError(404, "Account not found.");
    }

    if(credential.must_reset_password) {
        throw new AppError(400, "Please activate the account");
    }  

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await savePasswordToken(
        email,
        otpHash,
        expiresAt,
        PASSWORD_TOKEN_TYPE.RESET
    );

    await sendOtpEmail(
        email,
        otp
    );

    return {
        success: true,
        message: "OTP sent successfully.",
    };
}



export async function resetPasswordService(email, otp, newPassword, confirmPassword) {
    const credential = await findCredentialByEmail(email);

    if(!credential) {
        throw new AppError(404, "Account not found.");
    }

    if(credential.must_reset_password) {
        throw new AppError(400, "Please activate the account");
    }  
    
    if(newPassword !== confirmPassword) {
        throw new AppError(400, "Passwords do not match.");
    }

    validatePassword(newPassword);

    const passwordToken = await getPasswordToken(email);

    if (!passwordToken) {
        throw new AppError(400, "OTP not found.");
    }

    if (
        passwordToken.password_token_type !==
        PASSWORD_TOKEN_TYPE.RESET
    ) {
        throw new AppError(400, "Invalid OTP.");
    }

    if (
        passwordToken.password_token_expires_at &&
        passwordToken.password_token_expires_at < new Date()
    ) {
        throw new AppError(400, "OTP has expired.");
    }
    
    // Verify OTP
    const isValidOtp = verifyOtp(
        otp,
        passwordToken.password_token_hash
    );

    if (!isValidOtp) {
        throw new AppError(400, "Incorrect OTP.");
    }

    const user = await findCredentialsByEmail(email);

    // Compare plain text new password with stored hash
    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

  if (isSamePassword) {
    throw new Error(
        "New password cannot be the same as your current password."
    );
}

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updated = await updatePassword(
        email,
        hashedPassword
    );

    if (!updated) {
        throw new AppError(
            500,
            "Failed to reset the new password."
        );
    }

    // Clear OTP
    await clearPasswordToken(email);

    return {
        success: true,
        message: "Password reset successfully.",
    };
}



export async function activateAccountService(
    email,
    otp,
    newPassword,
    confirmPassword
) {
    // Validate input
    if (!email || !otp || !newPassword || !confirmPassword) {
        throw new AppError(400, "All fields are required.");
    }

    if (newPassword !== confirmPassword) {
        throw new AppError(400, "Passwords do not match.");
    }

    validatePassword(newPassword);

    // Find credentials
    const credential = await findCredentialByEmail(email);

    if (!credential) {
        throw new AppError(404, "Account not found.");
    }

    if (!credential.must_reset_password) {
        throw new AppError(400, "Account is already activated.");
    }

    // Fetch stored OTP
    const passwordToken = await getPasswordToken(email);

    if (!passwordToken) {
        throw new AppError(400, "OTP not found.");
    }

    if (
        passwordToken.password_token_type !==
        PASSWORD_TOKEN_TYPE.ACTIVATION
    ) {
        throw new AppError(400, "Invalid OTP.");
    }

    if (
        passwordToken.password_token_expires_at &&
        passwordToken.password_token_expires_at < new Date()
    ) {
        throw new AppError(400, "OTP has expired.");
    }

    // Verify OTP
    const isValidOtp = verifyOtp(
        otp,
        passwordToken.password_token_hash
    );

    if (!isValidOtp) {
        throw new AppError(400, "Incorrect OTP.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updated = await updatePassword(
        email,
        hashedPassword
    );

    if (!updated) {
        throw new AppError(
            500,
            "Failed to activate account."
        );
    }

    // Clear OTP
    await clearPasswordToken(email);

    // Update last login
    await touchLastLogin(email);

    // Fetch user
    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError(
            500,
            "User profile not found."
        );
    }

    // Generate login JWT
    const token = generateLoginToken(user);

    return {
        token,
        user,
        message: "Account activated successfully.",
    };
}
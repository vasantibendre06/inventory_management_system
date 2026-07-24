import bcrypt from "bcrypt";
import { findCredentialByEmail, updatePassword, getPasswordHash } from "../repository/credential.repository.js";
import { findUserByEmail, touchLastLogin } from "../repository/user.repository.js";
import generateLoginToken from "../utils/jwt/loginToken.js";
import generateResetToken from "../utils/jwt/resetToken.js";
import {validatePassword} from "../utils/validators/password.validator.js"
import {AUTH} from "../constants/auth.constants.js";
import {AppError} from "../utils/AppError.js";

const ALLOWED_DOMAIN = AUTH.COMPANY_DOMAIN

export async function loginUser(email, password) {
    // 1. Domain restriction — reject before even touching the DB
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
        throw new AppError(403, "Only company email addresses are allowed to log in.");
    }

    // 2. Look up the credential record
    const credential = await findCredentialByEmail(email);
    console.log("Credential from DB:", credential);

    console.log(
        "Type:",
        typeof credential.must_reset_password,
        "Value:",
        credential.must_reset_password
    );

    if (!credential) {
        throw new AppError(401, "Invalid email or password.");
    }

    // 3. Verify password against the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
        throw new AppError(401, "Invalid email or password.");
    }

    // 4. First Login
    if (credential.must_reset_password) {

        const resetToken = generateResetToken(email);

        return {
            mustResetPassword: true,
            resetToken,
        };
    }

    // 5. Normal login — issue the real session
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError(500, "Credential exists but no matching user profile was found.");
    }

    await touchLastLogin(email);
    const token = generateLoginToken(user);

    return {
        mustResetPassword: false,
        token,
        user,
    };
}

export async function resetPasswordService(email, newPassword) {

    validatePassword(newPassword);

    const currentHash = await getPasswordHash(email);

    const isSamePassword = await bcrypt.compare(newPassword, currentHash);

    if (isSamePassword) {
        throw new AppError(400, "New password must be different from the current password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await updatePassword(email, hashedPassword);
}
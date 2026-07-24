import {AppError} from "../AppError.js";

export function validatePassword(password) {

    if (!password) {
        throw new AppError(400, "Password is required.");
    }

    if (password.length < 8) {
        throw new AppError(
            400,
            "Password must be at least 8 characters long."
        );
    }

    if (!/[A-Z]/.test(password)) {
        throw new AppError(
            400,
            "Password must contain at least one uppercase letter."
        );
    }

    if (!/[a-z]/.test(password)) {
        throw new AppError(
            400,
            "Password must contain at least one lowercase letter."
        );
    }

    if (!/[0-9]/.test(password)) {
        throw new AppError(
            400,
            "Password must contain at least one digit."
        );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new AppError(
            400,
            "Password must contain at least one special character."
        );
    }
}
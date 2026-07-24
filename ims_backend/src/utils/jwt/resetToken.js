import jwt from "jsonwebtoken";

const generateResetToken = (email) => {
    if (!email) {
        throw new Error("Email is required to generate a reset token.");
    }

    return jwt.sign(
        {
            email,
            type: "PASSWORD_RESET",
        },
        process.env.RESET_JWT_SECRET,
        {
            expiresIn: process.env.RESET_TOKEN_EXPIRY,
        }
    );
};

export default generateResetToken;
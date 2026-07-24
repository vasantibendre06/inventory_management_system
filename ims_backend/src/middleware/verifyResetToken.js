import jwt from "jsonwebtoken";

const verifyResetToken = (req, res, next) => {
    try {
        const resetToken = req.cookies.resetToken;

        if(!resetToken) {
            return res.status(401).json({
                success: false,
                message: "Password reset authorization required.",
            });
        }

        const decoded = jwt.verify(resetToken, process.env.RESET_JWT_SECRET);

        if(decoded.type !== "PASSWORD_RESET") {
            return res.status(401).json({
                success: false,
                message: "Invalid Reset Token.",
            });          
        }

        req.user = {email: decoded.email};
        next();

    } catch (error) {
        console.error("Reset token verification failed:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired reset token.",
        }); 
    }
};

export default verifyResetToken;
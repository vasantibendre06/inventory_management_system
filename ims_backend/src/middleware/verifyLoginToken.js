import jwt from "jsonwebtoken";

const verifyLoginToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.json(401).json({
                success: false,
                message: "Authentication Required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.type !== "LOGIN") {
            return res.json(401).json({
                success: false,
                message: "Invalid token type.",
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        })
    }
};

export default verifyLoginToken;
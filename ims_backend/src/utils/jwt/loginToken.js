import jwt from "jsonwebtoken";

const generateLoginToken = (user) => {
    if (!user) {
        throw new Error("User is required to generate a login token.");
    }

    return jwt.sign(
        {
            emp_id: user.emp_id,
            email: user.email,
            role_code: user.role_code,
            role_name: user.role_name,
            type: "LOGIN",
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.LOGIN_TOKEN_EXPIRY,
        }
    );
};

export default generateLoginToken;
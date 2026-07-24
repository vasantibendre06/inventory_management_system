import express from "express";
import { login, resetPassword } from "../controllers/auth.controller.js";
import verifyLoginToken from "../middleware/verifyLoginToken.js";
import verifyResetToken from "../middleware/verifyResetToken.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", verifyLoginToken, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});

router.post( "/reset-password", verifyResetToken, resetPassword );

export default router;
import express from "express";
import { login, logout, resetPassword } from "../controllers/auth.controller.js";
import verifyLoginToken from "../middleware/verifyLoginToken.js";
import verifyResetToken from "../middleware/verifyResetToken.js";
import {activateAccount} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/login", login);

router.get("/me", verifyLoginToken, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});

router.post( "/reset-password", verifyResetToken, resetPassword );

router.post("/activate-account", activateAccount);

router.post("/logout", logout);

export default router;

// GET  /auth/verify-password-token

// POST /auth/set-password
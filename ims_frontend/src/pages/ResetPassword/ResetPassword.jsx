import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/AuthService";
import { toast } from "react-toastify";

import { Mail, KeyRound, ArrowLeft } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const email = sessionStorage.getItem("resetEmail") || "";

     useEffect(() => {
        // Enable this after connecting the backend
        if (!sessionStorage.getItem("resetEmail")) {
            navigate("/forgot-password");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            console.log({
                email,
                otp,
                newPassword,
                confirmPassword,
            });

            // API call later
            try {
                    const data = await resetPassword(
                        email,
                        otp,
                        newPassword,
                        confirmPassword
                    );

                    toast.success(data.message);

                    sessionStorage.removeItem("resetEmail");

                    navigate("/login");

                } catch (error) {
                    toast.error(
                        error.response?.data?.message ||
                        "Unable to reset password."
                    );

                    setNewPassword("");
                    setConfirmPassword("");
                }

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >
                <h2 className="auth-title">
                    Reset Password
                </h2>

                <p className="auth-subtitle">
                    Enter the verification code sent to your company email and
                    choose a new password.
                </p>

                <AuthInput
                    label="Company Email"
                    icon={Mail}
                    type="email"
                    value={email}
                    disabled
                />

                <AuthInput
                    label="Verification Code"
                    icon={KeyRound}
                    type="text"
                    placeholder="Enter the 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                />

                <PasswordInput
                    label="New Password"
                    placeholder="Create a new password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                />

                <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                />

                <AuthButton
                    loading={loading}
                    loadingText="Resetting Password..."
                >
                    Reset Password
                </AuthButton>

                <button
                    type="button"
                    className="auth-link auth-link--center"
                    onClick={() => navigate("/login")}
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
import { useState, useContext} from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { forgotPassword } from "../../services/AuthService";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const { backendURL } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = await forgotPassword(email);

            sessionStorage.setItem("resetEmail", email);

            toast.success(data.message);

            navigate("/reset-password");
        } catch (error) {
            console.log("Forgot Password Error:", error);
            console.log("Response:", error.response);
            console.log("Data:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to send OTP."
            );
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
                    Forgot Password
                </h2>

                <p className="auth-subtitle">
                    Enter your company email address and we'll send you a
                    verification code to reset your password.
                </p>

                <AuthInput
                    label="Company Email"
                    icon={Mail}
                    type="email"
                    placeholder="name@winrenders.com"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    autoComplete="email"
                    required
                />

                <AuthButton loading={loading}>
                    Send OTP
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

export default ForgotPassword;
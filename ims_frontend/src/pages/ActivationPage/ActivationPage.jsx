import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { activateAccount } from "../../services/AuthService";
import { toast } from "react-toastify";
import { KeyRound, Mail } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const ActivationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    console.log("Location state:", location.state);

    const { checkLogin } = useContext(AuthContext);

    const email = sessionStorage.getItem("activationEmail");

    console.log("Email from sessionStorage:", email);

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            
            console.log("Submitting activation...");
            const data = await activateAccount({
                email,
                otp,
                newPassword,
                confirmPassword,
            });
            console.log(data);

            if (data.success) {
                await checkLogin();

                toast.success(data.message);

                sessionStorage.removeItem("activationEmail");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);
            toast.error(
                error.response?.data?.message || "Activation failed."
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
                    Activate Your Account
                </h2>

                <p className="auth-subtitle">
                    Enter the OTP sent to your company email and create your
                    password.
                </p>

                <AuthInput
                    label="Company Email"
                    icon={Mail}
                    type="email"
                    value={email}
                    disabled
                />

                <AuthInput
                    label="One-Time Password"
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
                    placeholder="Create a strong password"
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
                    loadingText="Activating..."
                >
                    Activate Account
                </AuthButton>
            </form>
        </AuthLayout>
    );
};

export default ActivationPage;
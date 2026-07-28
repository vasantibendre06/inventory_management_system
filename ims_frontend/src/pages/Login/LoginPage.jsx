import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../services/AuthService";
import { toast } from "react-toastify";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import { Mail } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();

    const { checkLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const data = await login(email, password);
            console.log("Login response:", data);

            if(!data.success) {
                toast.error(data.message);
                return;
            } 

            // First-time login with temporary password
            if (data.mustResetPassword) {

                sessionStorage.setItem(
                    "activationEmail",
                    data.email
                );

                navigate("/activate-account");

                return;
            }

            // Refresh auth state from backend
            await checkLogin();

            toast.success("Login successful!");

            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <AuthLayout>
            {/* <div className="login-visual">
                <div className="login-visual__overlay" />
                <div className="login-visual__scanline" />
                <div className="login-visual__content">
                    <h1 className="login-visual__title">Precision inventory,<br />under control.</h1>
                    <p className="login-visual__caption">
                        Materials, machines, and stock — tracked with the same
                        precision as the equipment you build.
                    </p>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="company-logo">
                    <img src="logo.png" alt="WinRender Systems Logo"/>
                </div> */}

                <form className="auth-card" onSubmit={onSubmitHandler}>

                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-subtitle">
                        Sign in to your WinRender IMS account.
                    </p>

                    <AuthInput
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@winrenders.com"
                        autoComplete="username"
                        required
                    />

                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot password?
                    </button>

                    <AuthButton
                        loading={loading}
                        loadingText="Signing in..."
                    >
                        Log In
                    </AuthButton>

                    <p className="auth-footer-text">
                        Access restricted to company email accounts only.
                    </p>
                </form>
            {/* </div> */}
        </AuthLayout>
    );
}

export default LoginPage;
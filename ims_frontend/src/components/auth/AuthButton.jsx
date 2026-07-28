import { Loader2 } from "lucide-react";
import "./AuthLayout.css";

const AuthButton = ({
    children,
    loading = false,
    loadingText = "Please wait...",
    disabled = false,
    className = "",
    type = "submit",
    ...props
}) => {
    return (
        <button
            type={type}
            className={`auth-button ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2
                        size={18}
                        className="auth-button__spinner"
                    />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default AuthButton;
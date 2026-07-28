import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import "./AuthLayout.css";

const PasswordInput = ({
    label,
    error,
    className = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`auth-field ${className}`}>
            {/* Label */}
            {label && (
                <label className="auth-field__label">
                    {label}
                </label>
            )}

            {/* Input Container */}
            <div
                className={`auth-input ${
                    error ? "auth-input--error" : ""
                }`}
            >
                {/* Lock Icon */}
                <span className="auth-input__icon">
                    <Lock
                        size={18}
                        strokeWidth={2}
                    />
                </span>

                {/* Password Input */}
                <input
                    className="auth-input__control"
                    type={showPassword ? "text" : "password"}
                    {...props}
                    value={props.value ?? ""}
                />

                {/* Eye Button */}
                <button
                    type="button"
                    className="auth-input__toggle"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                >
                    {showPassword ? (
                        <EyeOff
                            size={18}
                            strokeWidth={2}
                        />
                    ) : (
                        <Eye
                            size={18}
                            strokeWidth={2}
                        />
                    )}
                </button>
            </div>

            {/* Error */}
            {error && (
                <p className="auth-field__error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordInput;
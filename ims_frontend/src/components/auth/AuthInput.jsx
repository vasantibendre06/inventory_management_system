import React from "react";
import "./AuthLayout.css";

const AuthInput = ({
    label,
    icon: Icon,
    error,
    className = "",
    ...props
}) => {
    return (
        <div className={`auth-field ${className}`}>
            {label && (
                <label className="auth-field__label">
                    {label}
                </label>
            )}

            <div
                className={`auth-input ${
                    error ? "auth-input--error" : ""
                }`}
            >
                {Icon && (
                    <span className="auth-input__icon">
                        <Icon size={18} strokeWidth={2} />
                    </span>
                )}

                <input
                    className="auth-input__control"
                    {...props}
                    value={props.value ?? ""}
                />
            </div>

            {error && (
                <p className="auth-field__error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;
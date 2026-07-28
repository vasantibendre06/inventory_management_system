import "./AuthLayout.css";

const AuthLayout = ({
    children,
    visualTitle = "Precision inventory,\nunder control.",
    visualCaption = "Materials, machines, and stock — tracked with the same precision as the equipment you build.",
}) => {
    return (
        <div className="auth-page">
            {/* ---------- Left Visual Panel ---------- */}
            <div className="auth-visual">
                <div className="auth-visual__overlay" />
                <div className="auth-visual__grid" />
                <div className="auth-visual__scanline" />

                <div className="auth-visual__content">
                    <h1 className="auth-visual__title">
                        {visualTitle.split("\n").map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </h1>

                    <p className="auth-visual__caption">
                        {visualCaption}
                    </p>

                    <div className="auth-visual__features">
                        <div className="auth-feature">
                            <span className="auth-feature__check">✓</span>
                            <span>Real-time inventory tracking</span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature__check">✓</span>
                            <span>Production & warehouse visibility</span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature__check">✓</span>
                            <span>Secure role-based access</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- Right Form Panel ---------- */}
            <div className="auth-form-panel">
                <div className="company-logo">
                    <img
                        src="/logo.png"
                        alt="WinRender Systems"
                    />
                </div>

                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import "./Header.css";



const Header = () => {
    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header__logo">
                WinRender IMS
            </div>

            <div className="header__right">
                <div className="header__user">
                    <span className="header__empid">
                        {user?.emp_id}
                    </span>

                    <span className="header__role">
                        {user?.role_name}
                    </span>

                    <span className="header__email">
                        {user?.email}
                    </span>
                </div>

                <button
                    className="header__logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
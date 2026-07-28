import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchCurrentUser, logout as logoutService, } from "../services/AuthService";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkLogin = async () => {
        try {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
            setIsLoggedIn(true);
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }



    const logout = async () => {
        try {
            await logoutService();
        } finally {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkLogin();

        const handleUnauthorized = () => {
            setUser(null);
            setIsLoggedIn(false);
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, []);

    const value = {
        user,
        isLoggedIn,
        loading,
        checkLogin,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}
import api from "./api";

export async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
}

export async function logout() {
    await api.post("/auth/logout");
}   

export async function fetchCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data.user;
}

export async function resetPassword(email, otp, newPassword, confirmPassword) {
    const response = await api.post("/auth/reset-password", { email, otp, newPassword, confirmPassword });
    return response.data; 
}

export async function forgotPassword(email) {
    const response = await api.post(
        "/auth/forgot-password",
        { email }
    );

    return response.data;
}

export async function activateAccount(payload) {
     console.log("Payload in service:", payload);
    const response = await api.post(
        "/auth/activate-account",
        payload
    );

    return response.data;
}


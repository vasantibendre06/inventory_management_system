import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // e.g. https://api.winrender.com/api
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;
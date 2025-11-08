import axios from "axios";
import {refresh} from "@api/requests/auth.js";

let accessToken = null;
let refreshPromise = null;

const getAccessToken = token => {
    accessToken = token;
};

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
    async config => {
        if (!getAccessToken) {
            console.warn("⚠️ No token, trying refresh...");
            try {
                const newToken = await refresh();
                if (newToken) {
                    accessToken = newToken;
                }
            } catch (e) {
                console.error("❌ Refresh failed before request:", e);
            }
        }

        const token = accessToken;
        console.log("🟢 Using token:", token ? token.slice(0, 10) + "..." : "NO TOKEN");

        if (token) config.headers.Authorization = `Bearer ${token}`;

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        return config;
    },
    err => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (originalRequest && !originalRequest._retry && [401, 403].includes(error.response?.status)) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = refresh()
                    .then(newToken => {
                        refreshPromise = null;
                        if (newToken) accessToken = newToken;
                        return newToken;
                    })
                    .catch(err => {
                        refreshPromise = null;
                        console.error("Refresh failed:", err);
                        throw err;
                    });
            }

            const newToken = await refreshPromise;

            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export {getAccessToken};
export default axiosInstance;
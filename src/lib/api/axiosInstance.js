import axios from "axios";
import { refresh } from "@api/requests/auth.js";

let accessTokenGetter = null;
let refreshPromise = null;

const setAccessTokenGetter = token => {
    accessTokenGetter = token;
};

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
    async config => {
        if (!accessTokenGetter) {
            console.warn("⚠️ No token, trying refresh...");
            try {
                const newToken = await refresh();
                if (newToken) {
                    accessTokenGetter = newToken;
                }
            } catch (e) {
                console.error("❌ Refresh failed before request:", e);
            }
        }

        const token = accessTokenGetter;
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
                        if (newToken) accessTokenGetter = newToken;
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

export { setAccessTokenGetter };
export default axiosInstance;
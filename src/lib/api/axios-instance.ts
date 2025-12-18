import axios from "axios";
import {API_URL} from "@/config";
import {refresh} from "@api/requests/auth";

let accessToken: string | null = null;
let refreshPromise = null;

function getAccessToken(token: string): void {
    accessToken = token;
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async config => {
        if (!getAccessToken) {
            console.warn("⚠️ No token, trying refresh...");
            try {
                const res = await refresh();

                if (res?.accessToken && res?.ok) {
                    accessToken = res.accessToken;
                }
            } catch (e) {
                console.error("❌ Refresh failed before request:", e);
            }
        }

        const token: string | null = accessToken;

        if (token) config.headers.Authorization = `Bearer ${token}`;

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        return config;
    },
    (err: Error) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (originalRequest && !originalRequest._retry && [401, 403].includes(error.response?.status)) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = refresh()
                    .then((newToken: string) => {
                        refreshPromise = null;
                        if (newToken) accessToken = newToken;
                        return newToken;
                    })
                    .catch((err: Error) => {
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
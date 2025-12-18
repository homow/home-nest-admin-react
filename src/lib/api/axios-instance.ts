import axios from "axios";
import {API_URL} from "@/config";
import {refresh} from "@api/requests/auth";

let accessToken: string | null = null;
let refreshPromise: ReturnType<typeof refresh> | null = null;

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
        if (!accessToken) {
            console.warn("No token, trying refresh...");
            try {
                const res = await refresh();

                if (res?.accessToken && res?.ok) {
                    getAccessToken(res?.accessToken);
                }
            } catch (e) {
                console.error("Refresh failed before request:", e);
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
                    .then((res) => {
                        refreshPromise = null;
                        const newToken = res?.ok ?
                            res?.accessToken :
                            null;
                        if (newToken) getAccessToken(newToken);
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
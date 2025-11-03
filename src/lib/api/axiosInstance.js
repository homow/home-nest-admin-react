import axios from "axios";
import {refresh} from "@api/requests/auth.js";

let accessTokenGetter = null;
let refreshPromise = null;

const setAccessTokenGetter = getter => {
    accessTokenGetter = getter;
};

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = accessTokenGetter;
        if (token) config.headers.Authorization = `Bearer ${token}`;

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        return config;
    },
    err => {
        console.log(err)
        return Promise.reject(err)
    });

axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (originalRequest && !originalRequest._retry && error.response?.status === 401) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = refresh()
                    .then(newToken => {
                        refreshPromise = null;
                        return newToken;
                    })
                    .catch(err => {
                        refreshPromise = null;
                        console.log(err)
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

export {setAccessTokenGetter}
export default axiosInstance;
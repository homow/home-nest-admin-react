import axios from "axios";
import {refresh} from "@api/callApi.js";

let accessTokenGetter = null;

const setAccessTokenGetter = (getter) => {
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
        const token = accessTokenGetter?.();
        if (token) config.headers.Authorization = `Bearer ${token}`;
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
        if (!originalRequest._retry && error.response?.status === 401) {
            originalRequest._retry = true;

            const newToken = await refresh();

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
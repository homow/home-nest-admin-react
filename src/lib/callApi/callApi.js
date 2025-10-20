"use strict";

import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest  = error.config;

        if (!originalRequest._retry && error.response?.status === 401) {
            originalRequest._retry = true;

            const newAccessToken = await refresh();

            if (newAccessToken && typeof newAccessToken !== "string") {
                // setNewAccess
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            }
        }

        return Promise.reject(error);
    }
)

const login = async (userInfo) => {
    const res = await axios.post("/api/auth/login", {...userInfo});
    const {ok, user, accessToken} = res.data;

    if (!ok) {
        const err = new Error("LOGIN_FAILED");
        err.payload = res.data;
        throw err;
    }

    return {ok: true, user, accessToken};
};

const refresh = async () => {
    try {
        const res = await axios.post('/api/auth/refresh', {}, {withCredentials: true});

        if (res.data.ok) {
            return res.data.access_token;
        }
    } catch (e) {
        return {ok: false, error: e};
    }
}

export {login, refresh};
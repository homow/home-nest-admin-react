"use strict";

import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${""}`;
    return config;
});

axios.interceptors.response.use(
    res => res.data,

    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;

            const {ok, accessToken} = await refresh()

            if (ok) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return axios(error.config);
            }
        }
        return Promise.reject(error);
    }
)

const login = async (userInfo) => {
    try {
        const res = await axios.post("/api/auth/login", {...userInfo});

        const {accessToken, user} = res.data;

        return {ok: true, user, accessToken};
    } catch (e) {
        const msg = e?.response?.data?.error || "NETWORK_ERROR"
        return {ok: false, error: msg};
    }
}

const refresh = async () => {
    try {
        const res = await axios.post('/api/auth/refresh', {}, {withCredentials: true});

        if (res.data.ok) {
            const access_token = res.data.access_token;
            // set in memory/context
        }
    } catch (e) {
        return {ok: false, error: e};
    }
}

export {login, refresh};

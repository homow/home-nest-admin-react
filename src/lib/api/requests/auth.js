"use strict";

import axios from "axios";
import {API_URL} from "@/config.ts";

const BASE_API_URL = `${API_URL}`;

const login = async (userInfo) => {
    const res = await axios.post(`${BASE_API_URL}/api/auth/login`, {...userInfo});
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
        const res = await axios.post(`${BASE_API_URL}/api/auth/refresh`, {}, {withCredentials: true});

        if (res.data.ok) {
            return res.data;
        }
    } catch (e) {
        return {ok: false, error: e};
    }
};

const logout = async () => {
    try {
        const res = await axios.post(`${BASE_API_URL}/api/auth/logout`, {}, {withCredentials: true});

        return {ok: true, res}
    } catch (e) {
        return {ok: false, error: e};
    }
};

export {login, refresh, logout};
"use strict";

import axios from "axios";

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
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });

        if (res.data.ok) {
            const access_token = res.data.access_token;
            // set in memory/context
        }
    } catch (e) {
        return {ok: false, error: e};
    }
}

export {login};

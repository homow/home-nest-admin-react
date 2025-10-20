"use strict";

import axios from "axios";

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
            return res.data;
        }
    } catch (e) {
        return {ok: false, error: e};
    }
}

export {login, refresh};
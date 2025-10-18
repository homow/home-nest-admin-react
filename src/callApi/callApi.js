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

export {login};

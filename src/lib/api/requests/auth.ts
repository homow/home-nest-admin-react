import type {UserLogin} from "@/types/auth.types";
import axios from "axios";
import {API_URL} from "@/config";

const BASE_API_URL = `${API_URL}`;

async function login(userInfo: UserLogin) {
    const res = await axios.post(`${BASE_API_URL}/api/auth/login`, {...userInfo});
    const {ok, user, accessToken} = res.data;

    if (!ok) {
        throw new Error(res.data.message || "LOGIN_FAILED");
    }

    return {ok: true, user, accessToken};
}

async function refresh() {
    try {
        const res = await axios.post(`${BASE_API_URL}/api/auth/refresh`, {}, {
            withCredentials: true
        });

        if (res.data.ok) {
            return res.data;
        }
    } catch (e) {
        return {ok: false, error: e};
    }
}

async function logout() {
    try {
        const res = await axios.post(`${BASE_API_URL}/api/auth/logout`, {}, {
            withCredentials: true
        });

        return {ok: true, res}
    } catch (e) {
        return {ok: false, error: e};
    }
}

export {login, refresh, logout};